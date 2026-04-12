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