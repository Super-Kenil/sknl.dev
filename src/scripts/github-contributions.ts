type Contribution = {
  date: string;
  count: number;
  level: number;
};

type ContributionResponse = {
  total: {
    lastYear: number;
  };
  contributions: Contribution[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isContribution(value: unknown): value is Contribution {
  if (!isRecord(value)) return false;
  return (
    typeof value.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.date) &&
    typeof value.count === 'number' &&
    Number.isFinite(value.count) &&
    Number.isInteger(value.level) &&
    typeof value.level === 'number' &&
    value.level >= 0 &&
    value.level <= 4
  );
}

function isContributionResponse(value: unknown): value is ContributionResponse {
  if (!isRecord(value) || !isRecord(value.total)) return false;
  return (
    typeof value.total.lastYear === 'number' &&
    Number.isFinite(value.total.lastYear) &&
    Array.isArray(value.contributions) &&
    value.contributions.every(isContribution)
  );
}

export async function loadGitHubContributions(container: HTMLElement): Promise<void> {
  if (container.dataset.status === 'loading' || container.dataset.status === 'loaded') return;

  const apiUrl = container.dataset.apiUrl;
  const username = container.dataset.username;
  const grid = container.querySelector<HTMLElement>('[data-contribution-grid]');
  const monthLabels = container.querySelector<HTMLElement>('[data-contribution-months]');
  const status = container.querySelector<HTMLElement>('[data-contribution-status]');
  const tooltip = container.querySelector<HTMLElement>('[data-contribution-tooltip]');
  const dayAnnouncement = container.querySelector<HTMLElement>('[data-day-announcement]');

  if (!apiUrl || !username || !grid || !monthLabels || !status || !tooltip || !dayAnnouncement) {
    throw new Error('GitHub contribution chart is missing required markup or configuration.');
  }

  container.dataset.status = 'loading';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Contribution API returned HTTP ${response.status}.`);
    }

    const payload: unknown = await response.json();
    if (!isContributionResponse(payload)) {
      throw new Error('Contribution API returned an invalid response.');
    }

    const fragment = document.createDocumentFragment();
    const monthFragment = document.createDocumentFragment();
    const days: HTMLElement[] = [];
    for (const [index, contribution] of payload.contributions.entries()) {
      const day = document.createElement('span');
      day.className = 'contribution-day';
      day.dataset.level = String(contribution.level);
      day.dataset.index = String(index);
      day.setAttribute('aria-hidden', 'true');
      days.push(day);

      const description = `${new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${contribution.date}T00:00:00.000Z`))}: ${contribution.count.toLocaleString()} ${
        contribution.count === 1 ? 'contribution' : 'contributions'
      }`;
      day.dataset.description = description;
      fragment.append(day);

      const date = new Date(`${contribution.date}T00:00:00.000Z`);
      if (date.getUTCDate() === 1) {
        const month = document.createElement('span');
        month.className = 'contribution-month-label';
        month.textContent = new Intl.DateTimeFormat(undefined, {
          month: 'short',
          timeZone: 'UTC',
        }).format(date);
        month.style.gridColumnStart = String(Math.floor(index / 7) + 1);
        monthFragment.append(month);
      }
    }

    grid.replaceChildren(fragment);
    monthLabels.replaceChildren(monthFragment);
    grid.setAttribute(
      'aria-label',
      `${username} made ${payload.total.lastYear.toLocaleString()} contributions in the past year. Focus and use arrow keys to inspect individual days.`,
    );
    status.textContent = `${payload.total.lastYear.toLocaleString()} contributions in the past year.`;
    container.dataset.status = 'loaded';
    bindContributionTooltip(grid, days, tooltip, dayAnnouncement);
  } catch (error) {
    container.dataset.status = 'error';
    status.textContent = 'GitHub activity is unavailable right now. Visit the profile instead.';
    console.error('Failed to load GitHub contributions.', error);
  }
}

function bindContributionTooltip(
  grid: HTMLElement,
  days: HTMLElement[],
  tooltip: HTMLElement,
  announcement: HTMLElement,
): void {
  let activeIndex = 0;
  let dismissalTimer: number | undefined;

  function hideTooltip(): void {
    tooltip.hidden = true;
    days[activeIndex]?.removeAttribute('data-active');
  }

  function showTooltip(day: HTMLElement, announce = false): void {
    window.clearTimeout(dismissalTimer);
    activeIndex = Number(day.dataset.index);
    for (const item of days) item.removeAttribute('data-active');
    day.dataset.active = 'true';
    tooltip.textContent = day.dataset.description ?? '';
    if (announce) announcement.textContent = tooltip.textContent;
    tooltip.hidden = false;

    const cell = day.getBoundingClientRect();
    const bubble = tooltip.getBoundingClientRect();
    const halfBubble = bubble.width / 2;
    const left = Math.min(
      Math.max(cell.left + cell.width / 2, halfBubble + 8),
      window.innerWidth - halfBubble - 8,
    );
    const above = cell.top >= bubble.height + 16;
    const top = above
      ? cell.top - bubble.height - 8
      : Math.min(cell.bottom + 8, window.innerHeight - bubble.height - 8);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function getDayFromTarget(target: EventTarget | null): HTMLElement | null {
    return target instanceof Element
      ? target.closest<HTMLElement>('.contribution-day')
      : null;
  }

  grid.addEventListener('pointerover', event => {
    if (event.pointerType === 'touch') return;
    const day = getDayFromTarget(event.target);
    if (day) showTooltip(day);
  });

  grid.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'touch' && document.activeElement !== grid) hideTooltip();
  });

  grid.addEventListener('click', event => {
    const day = getDayFromTarget(event.target);
    if (!day) return;
    showTooltip(day, true);
    dismissalTimer = window.setTimeout(hideTooltip, 3000);
  });

  grid.addEventListener('focus', () => {
    const day = days[activeIndex];
    if (day) showTooltip(day, true);
  });
  grid.addEventListener('blur', hideTooltip);

  grid.addEventListener('keydown', event => {
    const movements: Record<string, number> = {
      ArrowUp: -1,
      ArrowDown: 1,
      ArrowLeft: -7,
      ArrowRight: 7,
    };

    if (event.key === 'Escape') {
      hideTooltip();
      return;
    }

    if (event.key === 'Home') {
      activeIndex = 0;
    } else if (event.key === 'End') {
      activeIndex = days.length - 1;
    } else if (event.key in movements) {
      activeIndex = Math.max(0, Math.min(days.length - 1, activeIndex + movements[event.key]));
    } else {
      return;
    }

    event.preventDefault();
    const day = days[activeIndex];
    if (!day) return;
    showTooltip(day, true);
    day.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });
}
