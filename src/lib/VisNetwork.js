import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";

const VisNetwork = () => {
	// Create a ref to provide DOM access
	const visJsRef = useRef(null);
	useEffect(() => {
		// Once the ref is created, we'll be able to use vis
	}, [visJsRef]);
	return <div ref={visJsRef} />;
};

export default VisNetwork;
