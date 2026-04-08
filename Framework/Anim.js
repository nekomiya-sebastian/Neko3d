class Anim
{
	constructor( sprArr,fps = 4 )
	{
		this.sprs = sprArr
		
		this.frameTimer = new Timer( 1.0 / fps )
		this.curFrame = new Counter( sprArr.length )
	}
	
	Update( dt )
	{
		if( this.frameTimer.Update( dt ) )
		{
			this.frameTimer.Reset()
			if( this.curFrame.Tick() )
			{
				this.curFrame.Reset()
				return( true )
			}
		}
		return( false )
	}
	
	Draw( pos,nekoCam,flipped = false,centered = true )
	{
		// this.sprs[this.curFrame.GetCurItem()].Draw( pos.x,pos.y,gfx,flipped )
		nekoCam.DrawSprite( this.sprs[this.curFrame.GetCurItem()],
			pos,flipped,centered )
	}
	
	Reset()
	{
		this.frameTimer.Reset()
		this.curFrame.Reset()
	}
	
	SetFrame( frame )
	{
		NekoUtils.Assert( frame >= 0 && frame < this.curFrame.GetCount(),
			"Anim.SetFrame given invalid frame index! " + frame )
		this.curFrame.SetCurItem( frame )
	}
	
	GetFrame()
	{
		return( this.curFrame.GetCurItem() )
	}
	
	GetSize()
	{
		return( this.sprs[0].rect.GetSize() )
	}
	
	Loaded()
	{
		for( const spr of this.sprs )
		{
			if( !spr.loaded ) return( false )
		}
		return( true )
	}
}

Anim.GenSprArr = function( sprName,nSprs,sprSuffix = ".png" )
{
	const sprs = []
	for( let i = 0; i < nSprs; ++i ) sprs.push( new Sprite( sprName + ( i + 1 ) + sprSuffix ) )
	return( sprs )
}