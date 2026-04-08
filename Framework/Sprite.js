class Sprite
{
	constructor( path )
	{
		this.sprite = new Image()
		this.sprite.src = path
		this.rect = null
		
		this.loaded = false
		
		this.loadFuncs = []
		this.loadSelves = []
		
		const self = this
		this.sprite.onload = function()
		{
			self.rect = new Rect( 0,self.sprite.height,0,self.sprite.width )
			self.loaded = true
			
			for( let i = 0; i < self.loadFuncs.length; ++i ) self.loadFuncs[i]( self.loadSelves[i] )
		}
		this.sprite.onerror = function()
		{
			NekoUtils.Assert( false,"Sprite failed to load! " + path )
			self.loaded = false
		}
	}
	
	AddLoadFunc( func,self )
	{
		if( this.loaded ) func( self )
		else
		{
			this.loadFuncs.push( func )
			this.loadSelves.push( self )
		}
	}
	
	GetWidth()
	{
		return( this.rect.GetWidth() )
	}
	GetHeight()
	{
		return( this.rect.GetHeight() )
	}
	GetSize()
	{
		return( this.rect.GetSize() )
	}
	GetHSize()
	{
		return( this.rect.GetHalfSize() )
	}
}