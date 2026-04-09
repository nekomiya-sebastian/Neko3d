class CubeTestScene extends Scene
{
	constructor()
	{
		super()
		
		this.cubes = []
		this.selectedCube = -1
		
		this.addNewCube = new SingleKey( " " )
		this.destroySelectedCube = SingleKey.Code( Key.Backspace )
		this.selectLeft = SingleKey.Code( Key.Left )
		this.selectRight = SingleKey.Code( Key.Right )
		this.GenRandCube()
	}
	
	Update( sceneData )
	{
		const kbd = sceneData.kbd
		const mouse = sceneData.mouse
		const dt = sceneData.dt
		
		// add new model
		if( this.addNewCube.Update( kbd ) ) this.GenRandCube()
		
		// delete selected model
		if( this.destroySelectedCube.Update( kbd ) && this.cubes.length > 0 )
		{
			this.cubes.splice( this.selectedCube,1 )
			if( this.selectedCube >= this.cubes.length ) this.selectedCube = this.cubes.length - 1
		}
		
		// cycle cubes
		if( this.cubes.length > 0 )
		{
			if( this.selectLeft.Update( kbd ) )
			{
				if( --this.selectedCube < 0 ) this.selectedCube = this.cubes.length - 1
			}
			if( this.selectRight.Update( kbd ) )
			{
				if( ++this.selectedCube >= this.cubes.length ) this.selectedCube = 0
			}
		}
		
		// transform selected model
		if( this.selectedCube > -1 )
		{
			const movingCam = kbd.IsKeycodeDown( 16 ) && false
			const camFlip = ( movingCam ? -1 : 1 )
			const curTrans = ( movingCam
				? this.Get3dCam()
				: this.cubes[this.selectedCube].trans )
			
			const boxMoveSpd = 0.3 * camFlip
			const posMove = Vec3.Zero()
			if( kbd.IsKeyDown( "W" ) ) posMove.z += boxMoveSpd * dt
			if( kbd.IsKeyDown( "S" ) ) posMove.z -= boxMoveSpd * dt
			if( kbd.IsKeyDown( "A" ) ) posMove.x -= boxMoveSpd * dt
			if( kbd.IsKeyDown( "D" ) ) posMove.x += boxMoveSpd * dt
			if( kbd.IsKeyDown( "R" ) ) posMove.y -= boxMoveSpd * dt
			if( kbd.IsKeyDown( "F" ) ) posMove.y += boxMoveSpd * dt
			if( !posMove.Equals( Vec3.Zero() ) )
			{
				curTrans.GetPos().Add( posMove )
				if( movingCam )
				{
					for( const cube of this.cubes ) cube.trans.InvalidatePoints()
				}
			}
			
			const boxRotSpd = Math.PI * 0.05
			const rotMove = Vec3.Zero()
			if( kbd.IsKeyDown( "I" ) ) rotMove.x += boxRotSpd * dt
			if( kbd.IsKeyDown( "K" ) ) rotMove.x -= boxRotSpd * dt
			if( kbd.IsKeyDown( "J" ) ) rotMove.y += boxRotSpd * dt
			if( kbd.IsKeyDown( "L" ) ) rotMove.y -= boxRotSpd * dt
			if( kbd.IsKeyDown( "Z" ) ) rotMove.z += boxRotSpd * dt * camFlip
			if( kbd.IsKeyDown( "C" ) ) rotMove.z -= boxRotSpd * dt * camFlip
			
			rotMove.x = NekoUtils.OverflowClamp( rotMove.x,0,Math.PI * 2 )
			rotMove.y = NekoUtils.OverflowClamp( rotMove.y,0,Math.PI * 2 )
			rotMove.z = NekoUtils.OverflowClamp( rotMove.z,0,Math.PI * 2 )
			
			if( !rotMove.Equals( Vec3.Zero() ) )
			{
				curTrans.GetRot().Add( rotMove )
				if( movingCam )
				{
					for( const cube of this.cubes )
					{
						cube.trans.InvalidateRot()
						cube.trans.InvalidatePoints()
					}
				}
			}
			
			const boxScaleSpd = 0.05
			let scaleMove = curTrans.GetScale()
			if( kbd.IsKeyDown( "Q" ) ) scaleMove -= boxScaleSpd * dt
			if( kbd.IsKeyDown( "E" ) ) scaleMove += boxScaleSpd * dt
			if( scaleMove != curTrans.GetScale() )
			{
				curTrans.SetScale( scaleMove )
				if( movingCam )
				{
					for( const cube of this.cubes ) cube.trans.InvalidatePoints()
				}
			}
		}
	}
	
	Draw3d( neko3dDrawer )
	{
		for( const cube of this.cubes ) neko3dDrawer.QueueModel( cube )
	}
	
	DrawUI( nekoCam,textDrawer )
	{
		const tuts = [
			"WASD to move cube (RF for up down)",
			"IJKL & ZC to rotate, Q/E to scale",
			"[space] to add cube, [backspace] to delete",
			"left/right arrow keys to cycle cubes"
		]
		const tutHeight = 8
		const tutPos = new Vec2( 0,nekoCam.GetCamArea().bot - tutHeight * ( tuts.length + 1 ) )
		for( const tutText of tuts )
		{
			tutPos.y += tutHeight
			textDrawer.DrawText( tutText,tutPos,nekoCam,true,false )
		}
	}
	
	GenRandCube()
	{
		const cube = NekoModel.GenCube(
			NekoUtils.RandFloat( 0.2,2 ),
			NekoUtils.RandFloat( 0.2,2 ),
			NekoUtils.RandFloat( 0.2,2 )
			)
		cube.GetPos().z += 5
		this.cubes.push( cube )
		this.selectedCube = this.cubes.length - 1
	}
}