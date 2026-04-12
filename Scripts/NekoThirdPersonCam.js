class NekoThirdPersonCam extends Neko3dCam
{
	constructor()
	{
		super()
		
		this.mousePos = Vec2.Zero()
		
		// max amount of rotation allowed per frame (holdover from Sneko Slayers code)
		this.maxAimMove = NekoUtils.Deg2Rad( 90.0 - 1.0 )
		// max amount up/down you can look
		this.vertCutoff = Math.PI / 2.0 - NekoUtils.Deg2Rad( 10.0 )
		
		this.lookSens = 0.007
		
		this.mouseActive = false
		
		this.camMoveSpd = 0.4
		this.camDist = 15
		this.minCamDist = 0.8
		this.maxCamDist = 50
		this.GetPos().z = this.camDist
	}
	
	Update( kbd,mouse,dt )
	{
		let updatedTrans = false
		
		if( !mouse.down ) this.mouseActive = true
		else if( this.mouseActive )
		{
			// mouse aim code lifted from Sneko Slayers PlayerCamCtrl
			const aim = new Vec2(
				mouse.x - this.mousePos.x,
				mouse.y - this.mousePos.y
			).Scale( this.lookSens )
			
			if( !aim.Equals( Vec2.Zero() ) )
			{
				updatedTrans = true
				
				aim.y = NekoUtils.Clamp( aim.y,-this.maxAimMove,this.maxAimMove )
				
				const rot = this.GetRot()
				rot.x -= aim.y
				rot.x = NekoUtils.Clamp( rot.x,-this.vertCutoff,this.vertCutoff )
				rot.y -= aim.x
			}
		}
		this.mousePos.SetXY( mouse.x,mouse.y )
		
		let distMove = 0
		if( kbd.IsKeyDown( "W" ) ) distMove -= this.camMoveSpd * dt
		if( kbd.IsKeyDown( "S" ) ) distMove += this.camMoveSpd * dt
		if( distMove != 0 )
		{
			this.camDist += distMove
			this.camDist = NekoUtils.Clamp( this.camDist,this.minCamDist,this.maxCamDist )
			this.GetPos().z = this.camDist
			updatedTrans = true
		}
		
		return( updatedTrans )
	}
	
	UnloadCam()
	{
		this.mouseActive = false
	}
}