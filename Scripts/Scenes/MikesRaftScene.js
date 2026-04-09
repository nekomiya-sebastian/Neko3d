class MikesRaftScene extends Scene
{
	constructor()
	{
		super( new NekoFPSCam() )
		
		this.models = []
		
		const cube = NekoModel.GenCube()
		this.models.push( cube )
		cube.GetPos().z += 5
	}
	
	Update( mouse,kbd,dt )
	{
		// fps cam returns true when trans is updated, so we know to update all the models cached points
		if( this.Get3dCam().Update( kbd,mouse ) )
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