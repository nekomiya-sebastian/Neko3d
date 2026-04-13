class LightingTestScene extends Scene
{
	constructor()
	{
		super( new NekoThirdPersonCam(),new Sunlight() )
		
		this.models = []
		this.grayGlobe = NekoModel.GenerateGlobe( 1.1,10,12,new Nekolor( 100,100,100 ) )
		this.models.push( this.grayGlobe )
		
		this.discoToggle = new SingleKey( " " )
		this.isDisco = false
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
		
		const sunRotSpd = 0.1
		const rotAdd = Vec3.Zero()
		if( sceneData.kbd.IsKeyDown( "Z" ) ) rotAdd.y += sunRotSpd * sceneData.dt
		if( sceneData.kbd.IsKeyDown( "C" ) ) rotAdd.y -= sunRotSpd * sceneData.dt
		if( sceneData.kbd.IsKeyDown( "A" ) ) rotAdd.x += sunRotSpd * sceneData.dt
		if( sceneData.kbd.IsKeyDown( "D" ) ) rotAdd.x -= sunRotSpd * sceneData.dt
		if( rotAdd.IsNonZero() )
		{
			this.GetLight().GetRot().Add( rotAdd )
			
			for( const model of this.models ) model.InvalidateLighting()
		}
		
		if( this.discoToggle.Update( sceneData.kbd ) )
		{
			this.isDisco = !this.isDisco
			this.models[0] = ( this.isDisco
				? NekoModel.GenerateGlobe( 1.1,10,12 )
				: this.grayGlobe )
			
			this.models[0].trans.InvalidatePoints()
			this.models[0].trans.InvalidateRot()
			this.models[0].InvalidateLighting()
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
			"W/S to zoom",
			"Z/C & A/D to rotate light",
			"[space] toggle disco"
		]
		this.DrawTutText( tuts,nekoCam,textDrawer )
	}
}