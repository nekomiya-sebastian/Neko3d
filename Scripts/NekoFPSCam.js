class NekoFPSCam extends Neko3dCam
{
	constructor()
	{
		super()
		
		this.mousePos = Vec2.Zero()
		
		this.maxAimMove = 90.0 - 1.0
		this.vertCutoff = 10.0
		
		this.lookSens = 0.002
		this.moveSpd = 0.3
	}
	
	Update( kbd,mouse,dt )
	{
		let updatedTrans = false
		
		if( mouse.down )
		{
			// mouse aim code lifted from Sneko Slayers PlayerCamCtrl
			const aim = new Vec2(
				mouse.x - this.mousePos.x,
				mouse.y - this.mousePos.y
			).Scale( this.lookSens )
			
			if( !aim.Equals( Vec2.Zero() ) )
			{
				updatedTrans = true
				
				// todo: replace with NekoUtils.Clamp
				if( aim.y > this.maxAimMove ) aim.y = this.maxAimMove;
				if( aim.y < -this.maxAimMove ) aim.y = -this.maxAimMove;
				
				const rot = this.GetRot()
				rot.x -= aim.y
				if( rot.x > 90.0 - this.vertCutoff && rot.x < 180.0 ) rot.x = 90.0 - this.vertCutoff;
				if( rot.x < 270.0 + this.vertCutoff && rot.x > 180.0 ) rot.x = 270.0 + this.vertCutoff;
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
}