class Sunlight extends Transneko
{
	constructor( lightDir = Vec3.Down(),
		lightCol = Nekolor.FromHex( "#e6fdff" ),
		darkCol = Nekolor.FromHex( "#050821" ) )
	{
		super( Vec3.Zero(),lightDir )
		
		// lerp cols between these based on dot result
		this.lightCol = lightCol
		this.darkCol = darkCol
	}
	
	LightColor( dot,baseCol,setCol )
	{
		if( dot < 0 ) setCol.SetLerp( baseCol,this.darkCol,-dot )
		else setCol.SetLerp( baseCol,this.lightCol,dot )
	}
}