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
	
	Update( mouse,kbd,dt )
	{
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
			const curCube = this.cubes[this.selectedCube]
			const boxMoveSpd = 0.3
			const cubePos = curCube.GetPos()
			if( kbd.IsKeyDown( "W" ) ) cubePos.z += boxMoveSpd * dt
			if( kbd.IsKeyDown( "S" ) ) cubePos.z -= boxMoveSpd * dt
			if( kbd.IsKeyDown( "A" ) ) cubePos.x -= boxMoveSpd * dt
			if( kbd.IsKeyDown( "D" ) ) cubePos.x += boxMoveSpd * dt
			if( kbd.IsKeyDown( "R" ) ) cubePos.y -= boxMoveSpd * dt
			if( kbd.IsKeyDown( "F" ) ) cubePos.y += boxMoveSpd * dt
			
			const cubeRot = curCube.GetRot()
			const boxRotSpd = Math.PI * 0.05
			if( kbd.IsKeyDown( "I" ) ) cubeRot.x += boxRotSpd * dt
			if( kbd.IsKeyDown( "K" ) ) cubeRot.x -= boxRotSpd * dt
			if( kbd.IsKeyDown( "J" ) ) cubeRot.y += boxRotSpd * dt
			if( kbd.IsKeyDown( "L" ) ) cubeRot.y -= boxRotSpd * dt
			if( kbd.IsKeyDown( "Z" ) ) cubeRot.z += boxRotSpd * dt
			if( kbd.IsKeyDown( "C" ) ) cubeRot.z -= boxRotSpd * dt
			
			cubeRot.x = NekoUtils.OverflowClamp( cubeRot.x,0,Math.PI * 2 )
			cubeRot.y = NekoUtils.OverflowClamp( cubeRot.y,0,Math.PI * 2 )
			cubeRot.z = NekoUtils.OverflowClamp( cubeRot.z,0,Math.PI * 2 )
			
			const boxScaleSpd = 0.05
			let cubeScale = curCube.GetScale()
			if( kbd.IsKeyDown( "Q" ) ) cubeScale -= boxScaleSpd * dt
			if( kbd.IsKeyDown( "E" ) ) cubeScale += boxScaleSpd * dt
			curCube.SetScale( cubeScale )
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