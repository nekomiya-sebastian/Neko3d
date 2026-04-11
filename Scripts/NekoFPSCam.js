class NekoFPSCam extends Neko3dCam
{
	constructor()
	{
		super()
		
		this.mousePos = Vec2.Zero()
		
		// max amount of rotation allowed per frame (holdover from Sneko Slayers code)
		this.maxAimMove = NekoUtils.Deg2Rad( 90.0 - 1.0 )
		// max amount up/down you can look
		this.vertCutoff = Math.PI / 2.0 - NekoUtils.Deg2Rad( 10.0 )
		
		this.lookSens = 0.002
		this.moveSpd = 0.3
		
		this.mouseActive = false
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
		
		// movement code somewhat inspired from Sneko Slayers PlayerMove
		const moveInput = Vec3.Zero()
		if( kbd.IsKeyDown( "W" ) ) --moveInput.z
		if( kbd.IsKeyDown( "S" ) ) ++moveInput.z
		if( kbd.IsKeyDown( "A" ) ) ++moveInput.x
		if( kbd.IsKeyDown( "D" ) ) --moveInput.x
		if( kbd.IsKeyDown( "R" ) ) ++moveInput.y
		if( kbd.IsKeyDown( "F" ) ) --moveInput.y
		if( !moveInput.Equals( Vec3.Zero() ) )
		{
			updatedTrans = true
			
			const ang = this.GetRotCopy().y
			const moveVec = Vec3.Zero()
			moveVec.Add( new Vec3( Math.cos( ang ),0.0,Math.sin( ang ) ).Scale( moveInput.x ) )
			moveVec.Add( new Vec3(
				Math.cos( ang + Math.PI / 2.0 ),
				0.0,
				Math.sin( ang + Math.PI / 2.0 ) )
				.Scale( moveInput.z ) )
			moveVec.Add( new Vec3( 0,moveInput.y,0 ) )
			
			this.GetPos().Add( moveVec.Normalize().Scale( this.moveSpd ) )
		}
		
		return( updatedTrans )
	}
	
	UnloadCam()
	{
		this.mouseActive = false
	}
}