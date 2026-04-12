class Scene
{
	constructor( neko3dCam = new Neko3dCam(),light = null )
	{
		this.neko3dCam = neko3dCam
		this.light = light
	}
	
	Update( sceneData ) {}
	
	Draw3d( neko3dDrawer ) {}
	DrawUI( nekoCam,textDrawer ) {}
	
	DrawTutText( tuts,nekoCam,textDrawer )
	{
		const tutHeight = 8
		const tutPos = new Vec2( 0,nekoCam.GetCamArea().bot - tutHeight * ( tuts.length + 1 ) )
		for( const tutText of tuts )
		{
			tutPos.y += tutHeight
			textDrawer.DrawText( tutText,tutPos,nekoCam,true,false )
		}
	}
	
	UnloadScene()
	{
		this.neko3dCam.UnloadCam()
	}
	
	Get3dCam()
	{
		return( this.neko3dCam )
	}
	
	GetLight()
	{
		return( this.light )
	}
}