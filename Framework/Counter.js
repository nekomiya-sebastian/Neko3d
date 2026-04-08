class Counter
{
	constructor( count )
	{
		this.count = count
		this.cur = 0
	}
	
	Tick()
	{
		++this.cur
		
		return( this.IsDone() )
	}
	
	Reset()
	{
		this.cur = 0
	}
	
	SetCurItem( item )
	{
		NekoUtils.Assert( item >= 0 && item < this.count,
			"Counter.SetCurItem given out of bounds value! " + item )
		this.cur = item
	}
	
	IsDone()
	{
		return( this.cur >= this.count )
	}
	
	GetCurItem()
	{
		return( this.cur )
	}
	
	GetCount()
	{
		return( this.count )
	}
}