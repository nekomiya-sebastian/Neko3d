class Timer
{
	constructor( dur,startFinished = false )
	{
		const delay = dur * 60
		this.time = startFinished ? delay + 1 : 0
		this.dur = delay
	}
	
	Update( dt = -1 )
	{
		NekoUtils.Assert( dt > -1,"Invalid dt on timer!" )
		
		if( this.time <= this.dur ) this.time += dt
		
		return( this.IsDone() )
	}
	
	Reset()
	{
		this.time = 0
	}
	
	SetDur( duration )
	{
		this.dur = duration * 60
	}
	
	IsDone()
	{
		return( this.time > this.dur )
	}
	
	GetPercent()
	{
		return( Math.min( 1.0,this.time / this.dur ) )
	}
}