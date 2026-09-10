import './RatherAddUI.css'

function ratherAddUI () {
	return ( 
	<>
		<div className="add-rather-contain">
			<div className="add-rather-ui">
				<button className="close">X</button>

				<h1>Add a rather</h1>

				<p className="legend">left rather</p>
				<input type="" className='left-input' placeholder="Enter left rather here" />
				
				<p className="legend">right rather</p>
				<input type="" className='right-input' placeholder="Enter right rather here" />
			</div>
		</div>
	</>
	)
}

export default ratherAddUI
