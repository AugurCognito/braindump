import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';

const VisNetworkDiv = ({ backlinks }) => {
	const nodes = Object.keys(backlinks).map((key) => ({ id: key, label: key }));
	const edges = [];

	Object.keys(backlinks).forEach((key) => {
		const targets = backlinks[key];
		targets.forEach((target) => {
			edges.push({ from: key, to: target });
		});
	});

	const visJsRef = useRef(null);

	useEffect(() => {
		const network = new Network(visJsRef.current, { nodes, edges }, {
			autoResize: true, physics: {
				repulsion: {
					nodeDistance: 10
				}, edges: { color: '#ccc', length: 10 }
			}
		},);
		// Use `network` here to configure events, etc
	}, [visJsRef, nodes, edges]);

	return (
		<div
			ref={visJsRef}
			className="bg-gray-100 rounded-lg p-6"
			style={{ height: '40em', maxHeight: '512px' }}
		/>
	);
};

export default VisNetworkDiv;
