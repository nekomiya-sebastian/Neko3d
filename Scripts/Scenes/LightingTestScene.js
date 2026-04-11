class LightingTestScene extends Scene
{
	constructor()
	{
		super( new NekoFPSCam() )
		
		this.models = []
		const globe = NekoModel.GenerateGlobe( 1.1,10,12 )
		globe.GetPos().z += 5
		this.models.push( globe )
	}
	
	Update( sceneData )
	{
		if( this.Get3dCam().Update( sceneData.kbd,sceneData.mouse ) )
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
	DrawUI( nekoCam,textDrawer ) {}
}