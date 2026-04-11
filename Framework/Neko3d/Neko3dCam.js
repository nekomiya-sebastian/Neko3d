class Neko3dCam extends Transneko
{
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