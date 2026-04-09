class Neko3dCam extends Transneko
{
	TransPoint( point )
	{
		if( this.invalidateRot )
		{
			this.rotMat = this.GetRotMat()
			this.invalidateRot = false
		}
		
		point.Scale( this.scale )
		// translate before scale for camera for some reason
		point.Add( this.pos )
		this.rotMat.Apply( point,true )
		
		return( point )
	}
	CalcRotMat()
	{
		// switching x & y rot order seems to make camera behave like you would expect
		//  (just make sure not to roll :P)
		this.rotMat = Mat3.GetYRotMat( -this.rot.y )
			.MatMult( Mat3.GetXRotMat( this.rot.x ) )
			.MatMult( Mat3.GetZRotMat( this.rot.z ) )
	}
	
	UnloadCam() {}
}