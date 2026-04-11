class LightingTestScene extends Scene
{
	constructor()
	{
		super( new NekoThirdPersonCam() )
		
		this.models = []
		const globe = NekoModel.GenerateGlobe( 1.1,10,12 )
		this.models.push( globe )
	}
	
	Update( sceneData )
	{
		if( this.Get3dCam().Update( sceneData.kbd,sceneData.mouse,sceneData.dt ) )
		{
			for( const model of this.models )
			{
				model.trans.InvalidateRot()
				model.trans.InvalidatePoints()
			}
		}
	}
	
	Draw3d( neko3dDrawer )
	{
		for( const model of this.models ) neko3dDrawer.QueueModel( model )
	}
	DrawUI( nekoCam,textDrawer )
	{
		const tuts = [
			"Click & drag to rotate",
			"W/S to zoom"
		]
		this.DrawTutText( tuts,nekoCam,textDrawer )
	}
}