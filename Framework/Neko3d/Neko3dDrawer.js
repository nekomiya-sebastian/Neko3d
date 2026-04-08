class Neko3dDrawer
{
	constructor()
	{
		this.queuedModels = []
	}
	
	Draw( nekoCam )
	{
		const faces = []
		for( const model of this.queuedModels )
		{
			model.GenTransPoints()
			const gennedFaces = model.GetFaces()
			for( const face of gennedFaces ) faces.push( face )
		}
		
		// use highest to lowest dist from camera
		// 	so greater dist from camera goes first in the array, to be drawn over
		const drawFaceInds = []
		const drawFaceVals = []
		const camPos = Vec3.Zero()
		for( let i = 0; i < faces.length; ++i )
		{
			const curFace = faces[i]
			let maxDist = -Infinity
			for( const ind of curFace.faceData )
			{
				const curDistCalc = curFace.modelRef.GetTransPoint( ind )
					.Copy().Subtract( camPos ).GetDistSq()
				if( curDistCalc > maxDist ) maxDist = curDistCalc
			}
			
			let insertInd = 0
			for( insertInd; insertInd < drawFaceInds.length; ++insertInd )
			{
				if( drawFaceVals[insertInd] < maxDist ) break // insert before
			}
			drawFaceInds.splice( insertInd,0,i )
			drawFaceVals.splice( insertInd,0,maxDist )
		}
		// console.log( drawFaceInds )
		
		for( let i = 0; i < drawFaceInds.length; ++i )
		{
			const curFace = faces[drawFaceInds[i]]
			
			const polygon = []
			for( const ind of curFace.faceData )
			{
				const curPoint = curFace.modelRef.GetTransPoint( ind )
				if( curPoint.z > 0 ) polygon.push( curPoint.Project() )
			}
			nekoCam.DrawPolygon( polygon,curFace.GetColor(),false )
		}
		
		this.queuedModels.length = 0
	}
	
	QueueModel( nekoModel )
	{
		this.queuedModels.push( nekoModel )
	}
}