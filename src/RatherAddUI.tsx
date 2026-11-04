import { useState } from 'react'
import { requestAdd } from './utils.tsx';
import './RatherAddUI.css'

function ratherAddUI () {
	const [isClose, setClose] = useState(true);
	const [leftText, setLeft] = useState("");
	const [rightText, setRight] = useState("");

	const handleClose = (close: Boolean) => {
		if (!close) return "flex";
		else return "none";
	};

	const handleLeft = (event: any) => {
		setLeft(event.target.value);
	};

	const handleRight = (event: any) => {
		setRight(event.target.value);
	};

	const onClose = () => {
		setClose(!isClose);
	};
	const onAdd = async () => {
		const val = await requestAdd(leftText, rightText);
		if (val != 0) return;
		setLeft("");
		setRight("");
	};

	return ( 
	<>
		<button className="add-rather-btn" onClick={() => {setClose(false)}}>?</button>
		<div className="add-rather-contain" style={{display: handleClose(isClose)}} >
			<div className="add-rather-ui">
				<button className="close" onClick={onClose}>X</button>

				<h1>Add a rather</h1>

				<p className="legend">Left Rather</p>
				<input 
					type="" 
					className='left-input' 
					placeholder="Enter left rather here" 
					value={leftText} 
					onChange={handleLeft} 
				/>
				
				<p className="legend">Right Rather</p>
				<input 
					type="" 
					className='right-input' 
					placeholder="Enter right rather here" 
					value={rightText} 
					onChange={handleRight} 
				/>

				<button className="add" onClick={onAdd}>Request :3</button>
			</div>
		</div>
	</>
	)
}

export default ratherAddUI
