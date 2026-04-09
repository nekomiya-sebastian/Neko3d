class Scene
{
	constructor( neko3dCam = new Neko3dCam() )
	{
		this.neko3dCam = neko3dCam
	}
	
	Update( sceneData ) {}
	
	Draw3d( neko3dDrawer ) {}
	DrawUI( nekoCam,textDrawer ) {}
	
	Get3dCam()
	{
		return( this.neko3dCam )
	}
}