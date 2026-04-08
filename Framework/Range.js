class Range
{
	constructor( min,max )
	{
		this.min = min
		this.max = max
	}
	
	RandInt()
	{
		return( NekoUtils.RandInt( this.min,this.max ) )
	}
	
	RandFloat()
	{
		return( NekoUtils.RandFloat( this.min,this.max ) )
	}
}