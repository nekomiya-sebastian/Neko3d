class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.mouse = new Mouse( this.gfx )
		this.kbd = new Keyboard( this.gfx )
		this.nekoCam = new NekoCam( this.gfx )
		this.gfx.SetNekoCam( this.nekoCam )
		
		// this.boxPos = new Vec3( 0,0,1 )
		// this.boxRot = Vec3.Zero()
		// this.rotMat = Mat3.Identity()
		
		this.cubes = []
		this.selectedCube = -1
		this.neko3dDrawer = new Neko3dDrawer()
		
		this.canPress = true
		this.GenRandCube()
	}
	
	Update( dt )
	{
		// add new model
		if( this.kbd.IsKeyDown( "=" ) )
		{
			if( this.canPress )
			{
				this.GenRandCube()
			}
			this.canPress = false
		}
		else this.canPress = true
		
		// transform selected model
		if( this.selectedCube > -1 )
		{
			const curCube = this.cubes[this.selectedCube]
			const boxMoveSpd = 0.3
			const cubePos = curCube.GetPos()
			if( this.kbd.IsKeyDown( "R" ) ) cubePos.y -= boxMoveSpd * dt
			if( this.kbd.IsKeyDown( "F" ) ) cubePos.y += boxMoveSpd * dt
			if( this.kbd.IsKeyDown( "A" ) ) cubePos.x -= boxMoveSpd * dt
			if( this.kbd.IsKeyDown( "D" ) ) cubePos.x += boxMoveSpd * dt
			
			const boxZoomSpd = 0.1
			if( this.kbd.IsKeyDown( "W" ) ) cubePos.z += boxZoomSpd * dt
			if( this.kbd.IsKeyDown( "S" ) ) cubePos.z -= boxZoomSpd * dt
			
			// const prevBoxRot = this.boxRot.Copy()
			const cubeRot = curCube.GetRot()
			const boxRotSpd = Math.PI * 0.05
			if( this.kbd.IsKeyDown( "Z" ) ) cubeRot.z += boxRotSpd * dt
			if( this.kbd.IsKeyDown( "C" ) ) cubeRot.z -= boxRotSpd * dt
			if( this.kbd.IsKeyDown( "I" ) ) cubeRot.x += boxRotSpd * dt
			if( this.kbd.IsKeyDown( "K" ) ) cubeRot.x -= boxRotSpd * dt
			if( this.kbd.IsKeyDown( "J" ) ) cubeRot.y += boxRotSpd * dt
			if( this.kbd.IsKeyDown( "L" ) ) cubeRot.y -= boxRotSpd * dt
			
			cubeRot.x = NekoUtils.OverflowClamp( cubeRot.x,0,Math.PI * 2 )
			cubeRot.y = NekoUtils.OverflowClamp( cubeRot.y,0,Math.PI * 2 )
			cubeRot.z = NekoUtils.OverflowClamp( cubeRot.z,0,Math.PI * 2 )
		}
	}
	
	Draw()
	{
		this.nekoCam.DrawCamArea()
		
		for( const cube of this.cubes ) this.neko3dDrawer.QueueModel( cube )
		
		this.neko3dDrawer.Draw( this.nekoCam )
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

const delay = 1000.0 / 60.0
const main = new Main()
let prevTime = Date.now()
setInterval( function()
{
	const now = Date.now()
	const dt = ( now - prevTime ) / 30
	prevTime = now
	
	main.Update( dt )
	main.gfx.DrawRect( 0,0,main.gfx.width,main.gfx.height,"#000000" )
	main.Draw()
},delay )