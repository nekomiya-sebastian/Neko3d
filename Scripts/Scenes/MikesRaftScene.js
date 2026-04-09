class MikesRaftScene extends Scene
{
	constructor()
	{
		super( new NekoFPSCam() )
		
		this.models = []
		
		const cube1 = this.GenRaftCube()
		cube1.GetPos().z += 5
		this.models.push( cube1 )
		const cube2 = this.GenRaftCube()
		cube2.GetPos().x += 5
		cube2.GetPos().z += 5
		this.models.push( cube2 )
		
		this.addCube = new SingleKey( "E" )
		this.delCube = new SingleKey( "Q" )
		
		this.cubeFaceDirMap = [
			Vec3.Up(),
			Vec3.Down(),
			Vec3.Left(),
			Vec3.Right(),
			Vec3.Forward(),
			Vec3.Back()
		]
		
		this.ghostCube = NekoModel.GenCube()
		this.ghostCubeColor = "LemonChiffon"
		this.drawGhostCube = false
		
		this.prevMousePos = Vec3.Zero()
	}
	
	Update( sceneData )
	{
		// fps cam returns true when trans is updated, so we know to update all the models cached points
		let camUpdated = false
		if( this.Get3dCam().Update( sceneData.kbd,sceneData.mouse ) )
		{
			camUpdated = true
			
			// update all model transs
			for( const model of this.models )
			{
				model.trans.InvalidateRot()
				model.trans.InvalidatePoints()
			}
		}
		
		if( camUpdated || !this.prevMousePos.Equals( sceneData.mouse.GetPos() ) )
		{
			// update ghost cube loc
			const targetCubeData = this.GetTargetCubeData( sceneData )
			if( targetCubeData != null )
			{
				this.ghostCube.GetPos().Set( targetCubeData.targetCube.trans.GetPosCopy()
					.Add( targetCubeData.faceNormal ) )
				
				this.ghostCube.GenTransPoints( this.Get3dCam() )
				
				this.drawGhostCube = true
			}
			else this.drawGhostCube = false
		}
		
		const willAdd = this.addCube.Update( sceneData.kbd )
		const willDel = this.delCube.Update( sceneData.kbd )
		if( willAdd || willDel )
		{
			const targetCubeData = this.GetTargetCubeData( sceneData )
			
			if( targetCubeData != null )
			{
				if( willAdd )
				{
					const newCubePos = this.models[targetCubeData.cubeInd].trans.GetPosCopy()
						.Add( targetCubeData.faceNormal )
					let canAdd = true
					for( const cube of this.models )
					{
						if( cube.trans.GetPosCopy().Equals( newCubePos ) )
						{
							canAdd = false
							break
						}
					}
					
					if( canAdd )
					{
						const newCube = this.GenRaftCube()
						newCube.GetPos().Set( newCubePos )
						this.models.push( newCube )
					}
				}
				else if( willDel )
				{
					this.models.splice( targetCubeData.cubeInd,1 )
				}
			}
		}
		
		this.prevMousePos = sceneData.mouse.GetPos().Copy()
	}
	
	Draw3d( neko3dDrawer )
	{
		for( const model of this.models ) neko3dDrawer.QueueModel( model )
	}
	DrawUI( nekoCam,textDrawer )
	{
		// render ghost cube
		if( this.drawGhostCube )
		{
			for( const face of this.ghostCube.faces )
			{
				const ghostPolygon = []
				for( const ind of face )
				{
					const curPoint = this.ghostCube.GetTransPoint( ind )
					if( curPoint.z > 0 ) ghostPolygon.push( curPoint.Project() )
				}
				nekoCam.DrawPolygon( ghostPolygon,this.ghostCubeColor,true )
			}
		}
	}
	
	GetTargetCubeData( sceneData )
	{
		const camPos = this.Get3dCam().GetPosCopy()
		
		const mousePos = sceneData.nekoCam.Scr2WorldPos3d( sceneData.mouse.GetPos() )
		// check cube face hit and add new cube in that direction
		const allFaces = sceneData.neko3dDrawer.GenTransFaceList( this.Get3dCam() )
		
		let minDist = Infinity
		let minInd = -1
		for( let i = 0; i < allFaces.length; ++i )
		{
			const face = allFaces[i]
			if( face.GetRect().Contains( mousePos.x,mousePos.y ) )
			{
				const curDist = face.GetCenter().Copy().Subtract( camPos )
					.GetDistSq()
				if( curDist < minDist )
				{
					minDist = curDist
					minInd = i
				}
			}
		}
		
		if( minInd < 0 ) return( null )
		else
		{
			const result = {}
			
			result.cubeInd = Math.floor( minInd / 6 )
			result.targetCube = this.models[result.cubeInd]
			result.faceNormal = this.cubeFaceDirMap[minInd % 6]
			
			return( result )
		}
	}
	
	GenRaftCube()
	{
		const raftCube = NekoModel.GenCube()
		
		raftCube.colors = [
			"#502d12",
			"#c09d63",
			"#7c5622",
			"#7c5622",
			"#a47e3d",
			"#64431b"
		]
		
		return( raftCube )
	}
}