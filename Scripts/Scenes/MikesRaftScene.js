class MikesRaftScene extends Scene
{
	constructor()
	{
		super( new NekoFPSCam() )
		
		this.Get3dCam().GetPos().z += 5
		
		this.models = []
		this.cubes = []
		
		// init raft cube
		const cube1 = this.GenRaftCube()
		this.cubes.push( cube1 )
		// const cube2 = this.GenRaftCube()
		// cube2.GetPos().z += 1
		// this.cubes.push( cube2 )
		// const cube3 = this.GenRaftCube()
		// cube3.GetPos().z += 2
		// this.cubes.push( cube3 )
		
		// mike the sneko is laggy so remove him... for now...
		// this.GenMike()
		
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
		this.ghostCubeColor = "#ffe398"
		this.drawGhostCube = false
		
		this.cubeFuncs = [
			this.GenRaftCube,
			this.GenOceanCube,
			this.GenSailCube
		]
		this.ghostCubeCols = [
			"#ffe398", // raft
			"#bbffe6", // ocean
			"#fdfdf9" // sail
		]
		this.cubeType = 0
		
		this.cubeTypeUp = new SingleKey( "C" )
		this.cubeTypeDown = new SingleKey( "Z" )
		
		this.prevMousePos = Vec3.Zero()
	}
	
	Update( sceneData )
	{
		// fps cam returns true when trans is updated, so we know to update all the models cached points
		let camUpdated = false
		if( this.Get3dCam().Update( sceneData.kbd,sceneData.mouse ) )
		{
			camUpdated = true
			
			// update all model transnekos
			for( const cube of this.cubes )
			{
				cube.trans.InvalidateRot()
				cube.trans.InvalidatePoints()
			}
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
		
		this.prevMousePos = sceneData.mouse.GetPos().Copy()
		
		const willAdd = this.addCube.Update( sceneData.kbd )
		const willDel = this.delCube.Update( sceneData.kbd )
		if( willAdd || willDel )
		{
			const targetCubeData = this.GetTargetCubeData( sceneData )
			
			if( targetCubeData != null )
			{
				if( willAdd )
				{
					const newCubePos = this.cubes[targetCubeData.cubeInd].trans.GetPosCopy()
						.Add( targetCubeData.faceNormal )
					let canAdd = true
					for( const cube of this.cubes )
					{
						if( cube.trans.GetPosCopy().Equals( newCubePos ) )
						{
							canAdd = false
							break
						}
					}
					
					if( canAdd )
					{
						const newCube = this.cubeFuncs[this.cubeType]()
						newCube.GetPos().Set( newCubePos )
						this.cubes.push( newCube )
					}
				}
				else if( willDel && this.cubes.length > 1 )
				{
					this.cubes.splice( targetCubeData.cubeInd,1 )
				}
			}
		}
		
		if( this.cubeTypeUp.Update( sceneData.kbd ) )
		{
			if( ++this.cubeType >= this.cubeFuncs.length ) this.cubeType = 0
		}
		if( this.cubeTypeDown.Update( sceneData.kbd ) )
		{
			if( --this.cubeType < 0 ) this.cubeType = this.cubeFuncs.length - 1
		}
	}
	
	Draw3d( neko3dDrawer )
	{
		for( const cube of this.cubes ) neko3dDrawer.QueueModel( cube )
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
				nekoCam.DrawPolygon( ghostPolygon,this.ghostCubeCols[this.cubeType],true )
			}
		}
		
		const tuts = [
			"WASD & RF to move",
			"left click + move mouse to aim",
			"[E] to add cube, [Q] to delete",
			"Z/C to cycle cube type",
			"Build your raft :D"
			// "Build a raft for Mike the Sneko!"
		]
		const tutHeight = 8
		const tutPos = new Vec2( 0,nekoCam.GetCamArea().bot - tutHeight * ( tuts.length + 1 ) )
		for( const tutText of tuts )
		{
			tutPos.y += tutHeight
			textDrawer.DrawText( tutText,tutPos,nekoCam,true,false )
		}
	}
	
	GetTargetCubeData( sceneData )
	{
		const camPos = this.Get3dCam().GetPosCopy()
		
		const mousePos = sceneData.nekoCam.Scr2WorldPos3d( sceneData.mouse.GetPos() )
		// check cube face hit and add new cube in that direction
		const allFaces = sceneData.neko3dDrawer.GenTransFaceList( this.cubes,this.Get3dCam() )
		
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
			result.targetCube = this.cubes[result.cubeInd]
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
	GenOceanCube()
	{
		const oceanCube = NekoModel.GenCube()
		oceanCube.colors = [
			"#171f6c",
			"#80ebda",
			"#3cb4bd",
			"#5cd4cc",
			"#6688db",
			"#4d69bd"
		]
		return( oceanCube )
	}
	GenSailCube()
	{
		const sailCube = NekoModel.GenCube()
		sailCube.colors = [
			"#908d8f",
			"#fdfdf9",
			"#a9a7a8",
			"#c7c7c7",
			"#fff5e8",
			"#fce7d3"
		]
		return( sailCube )
	}
	
	GenSnekoCube( w,h,d )
	{
		return( NekoModel.GenCube( w,h,d,
			[
				"#167238",
				"#c5ff9f",
				"#46ba4e",
				"#2a9443",
				"#96ea75",
				"#6dd05a",
			] ) )
	}
	GenMike()
	{
		const snekoHead = this.GenSnekoCube( 0.4,0.4,0.4 )
		snekoHead.GetPos().y -= 0.9
		this.models.push( snekoHead )
		const snekoBody = this.GenSnekoCube( 0.3,0.3,0.55 )
		snekoBody.GetPos().y -= 0.8
		snekoBody.GetPos().z += 1
		this.models.push( snekoBody )
		const snekoTail = this.GenSnekoCube( 0.2,0.2,0.9 )
		snekoTail.GetPos().y -= 0.7
		snekoTail.GetPos().z += 2
		this.models.push( snekoTail )
		
		const leftArm = this.GenSnekoCube( 0.7,0.15,0.15 )
		leftArm.GetPos().x -= 0.8
		leftArm.GetPos().y -= 0.7
		leftArm.GetPos().z += 0.2
		this.models.push( leftArm )
		const rightArm = this.GenSnekoCube( 0.7,0.15,0.15 )
		rightArm.GetPos().x += 0.8
		rightArm.GetPos().y -= 0.7
		rightArm.GetPos().z += 0.2
		this.models.push( rightArm )
		
		const leftMimi = this.GenSnekoCube( 0.15,0.25,0.15 )
		leftMimi.GetPos().x -= 0.25
		leftMimi.GetPos().y -= 1.3
		leftMimi.GetPos().z += 0.1
		this.models.push( leftMimi )
		const rightMimi = this.GenSnekoCube( 0.15,0.25,0.15 )
		rightMimi.GetPos().x += 0.25
		rightMimi.GetPos().y -= 1.3
		rightMimi.GetPos().z += 0.1
		this.models.push( rightMimi )
		
		const eyeCols = [
				"#71033e",
				"#ff8b94",
				"#9a0946",
				"#d01552",
				"#f5304c",
				"#fd586b",
			]
		const leftEye = NekoModel.GenCube( 0.1,0.1,0.1,eyeCols )
		leftEye.GetPos().x -= 0.2
		leftEye.GetPos().y -= 1
		leftEye.GetPos().z -= 0.3
		this.models.push( leftEye )
		const rightEye = NekoModel.GenCube( 0.1,0.1,0.1,eyeCols )
		rightEye.GetPos().x += 0.2
		rightEye.GetPos().y -= 1
		rightEye.GetPos().z -= 0.3
		this.models.push( rightEye )
	}
}