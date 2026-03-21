import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { id: post.id },
		props: { post },
	}));
}

export const GET = async ({ props }: { props: any }) => {
	const { post } = props;

	const fontData = await fetch(
		'https://unpkg.com/inter-font@3.19.0/ttf/Inter-Bold.ttf'
	).then((res) => res.arrayBuffer());

	const fontDataRegular = await fetch(
		'https://unpkg.com/inter-font@3.19.0/ttf/Inter-Regular.ttf'
	).then((res) => res.arrayBuffer());

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					backgroundColor: '#232228',
					backgroundImage: `
						linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
						linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
					`,
					backgroundSize: '80px 80px',
					padding: '72px 80px',
					fontFamily: 'Inter',
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								fontSize: '22px',
								fontWeight: 'bold',
								color: '#f5f4dc',
								opacity: 0.9,
                marginTop: 8,
								letterSpacing: '0.02em',
							},
							children: 'Super Kenil',
						},
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								gap: '0px',
								flex: 1,
								justifyContent: 'center',
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											fontSize: '64px',
											fontWeight: 'bold',
											color: '#efe780',
											lineHeight: 1.15,
											maxWidth: '900px',
											wordBreak: 'break-word',
											letterSpacing: '-0.02em',
										},
										children: post.data.title,
									},
								},
								...(post.data.description ? [{
									type: 'div',
									props: {
										style: {
											fontSize: '28px',
											fontWeight: 'normal',
											color: '#f5f4dc',
											opacity: 0.6,
											lineHeight: 1.5,
											maxWidth: '820px',
											marginTop: '24px',
											wordBreak: 'break-word',
										},
										children: post.data.description,
									},
								}] : []),
							],
						},
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								gap: '20px',
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											width: '100%',
											height: '1px',
											backgroundColor: 'rgba(245, 244, 220, 0.15)',
										},
										children: '',
									},
								},
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
										},
										children: [
											{
												type: 'div',
												props: {
													style: { color: 'transparent' },
													children: ' ',
												},
											},
											{
												type: 'div',
												props: {
													style: {
														display: 'flex',
														alignItems: 'center',
														gap: '10px',
													},
													children: [
														{
															type: 'svg',
															props: {
																xmlns: 'http://www.w3.org/2000/svg',
																width: '22',
																height: '22',
																viewBox: '0 0 24 24',
																fill: 'none',
																stroke: '#f5f4dc',
																'stroke-width': '2',
																'stroke-linecap': 'round',
																'stroke-linejoin': 'round',
																style: { opacity: 0.7 },
																children: [
																	{
																		type: 'circle',
																		props: { cx: '12', cy: '12', r: '10' },
																	},
																	{
																		type: 'path',
																		props: {
																			d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20',
																		},
																	},
																	{
																		type: 'path',
																		props: { d: 'M2 12h20' },
																	},
																],
															},
														},
														{
															type: 'div',
															props: {
																style: {
																	fontSize: '22px',
																	fontWeight: 'normal',
																	color: '#f5f4dc',
																	opacity: 0.7,
																	letterSpacing: '0.01em',
																},
																children: 'sknl.dev',
															},
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Inter',
					data: fontData,
					weight: 700,
					style: 'normal',
				},
				{
					name: 'Inter',
					data: fontDataRegular,
					weight: 400,
					style: 'normal',
				},
			],
		}
	);

	const resvg = new Resvg(svg);
	const pngBuffer = resvg.render().asPng();

	return new Response(pngBuffer, {
		headers: {
			'Content-Type': 'image/png',
		},
	});
};