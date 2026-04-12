class Nekolor
{
	constructor( r,g,b )
	{
		this.r = r
		this.g = g
		this.b = b
	}
	
	GetDrawableColor()
	{
		return( "rgb(" + this.r + "," + this.g + "," + this.b + ")" )
	}
	
	Lerp( c2,percent )
	{
		return( this.SetLerp( this,c2,percent ) )
	}
	SetLerp( c1,c2,percent )
	{
		// this.r = ( c1.r + c2.r ) * percent
		// this.g = ( c1.g + c2.g ) * percent
		// this.b = ( c1.b + c2.b ) * percent
		this.r = c1.r * ( 1 - percent ) + c2.r * percent
		this.g = c1.g * ( 1 - percent ) + c2.g * percent
		this.b = c1.b * ( 1 - percent ) + c2.b * percent
		return( this )
	}
	
	Copy()
	{
		return( new Nekolor( this.r,this.g,this.b ) )
	}
}

Nekolor.RandColor = function()
{
	return( new Nekolor(
		NekoUtils.RandInt( 0,255 ),
		NekoUtils.RandInt( 0,255 ),
		NekoUtils.RandInt( 0,255 )
	) )
}

Nekolor.FromHex = function( hex )
{
	const r = hex.substr( 1,2 )
	const g = hex.substr( 3,2 )
	const b = hex.substr( 5,2 )
	
	return( new Nekolor( 
		Number( "0x" + r ),
		Number( "0x" + g ),
		Number( "0x" + b ) ) )
}

Nekolor.Lerp = function( c1,c2,percent )
{
	return( c1.Lerp( c2,percent ) )
}