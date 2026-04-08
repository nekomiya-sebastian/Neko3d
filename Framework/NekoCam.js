class NekoCam
{
	constructor( gfx )
	{
		this.gfx = gfx
		
		// modifiable vals
		const pixelSize = NekoCam.PixelSize // # of pixels per unit
		this.camSize = new Vec2( 1,1 ).Scale( pixelSize )
		
		this.camPos = Vec2.Zero()// .Add( this.camSize.Copy().Divide( 2 ) )
		const camHSize = this.camSize.Copy().Divide( 2 )
		this.camRect = new Rect( -camHSize.y,camHSize.y,-camHSize.x,camHSize.x )
		// this.screenRect = new Rect( 0,gfx.height,0,gfx.width )
		this.scale = 1
		// this.screenHSize = this.screenRect.GetHalfSize()
		this.screenHSize = new Vec2( gfx.width / 2,gfx.height / 2 )
		
		this.cachedCamPos = this.camPos.Copy()
		this.cachedCamRect = this.camRect.Copy()
		
		this.OnResize( this )
		
		this.MoveCam( Vec2.Zero() )
	}
	
	OnResize( self )
	{
		// self.screenRect.SetTBLR( 0,self.gfx.height,0,self.gfx.width )
		// self.screenHSize = self.screenRect.GetHalfSize()
		self.screenHSize.SetXY( self.gfx.width / 2,self.gfx.height / 2 )
		
		const xScale = self.gfx.width / self.camSize.x
		const yScale = self.gfx.height / self.camSize.y
		self.scale = Math.min( xScale,yScale )
	}
	
	MoveCam( move )
	{
		this.camPos.Add( move )
		this.camRect.MoveTo( this.camPos.Copy().Subtract( this.camRect.GetSize().Scale( 0.5 ) ) )
	}
	
	// draw to screen without cam pos offset
	SetUIMode( uiMode )
	{
		if( uiMode )
		{
			this.cachedCamPos = this.camPos.Copy()
			this.cachedCamRect = this.camRect.Copy()
			this.camPos.SetXY( 0,0 )
		}
		else
		{
			this.camPos = this.cachedCamPos.Copy()
			this.camRect = this.cachedCamRect.Copy()
		}
		this.MoveCam( Vec2.Zero() )
	}
	
	// worldPos in world coords, not screen coords
	DrawSprite( spr,worldPos,flipped = false,centered = true )
	{
		if( spr.loaded )
		{
			const rectRect = Rect.FromXYWH( spr.rect.left,spr.rect.top,
				spr.rect.GetWidth(),spr.rect.GetHeight() )
			rectRect.MoveTo( worldPos )
			if( centered ) rectRect.MoveBy( rectRect.GetHalfSize().Scale( -1 ) )
			if( this.camRect.Overlaps( rectRect ) )
			{
				const drawPos = this.World2ScrPos( worldPos.Copy().Subtract( this.camPos ) )
				if( centered ) drawPos.Subtract( spr.rect.GetHalfSize().Scale( this.scale ) )
				this.gfx.DrawSprite( drawPos.x,drawPos.y,spr,flipped,this.scale )
			}
		}
	}
	DrawClippedSprite( spr,srcLoc,srcSize,letterSize,worldPos )
	{
		if( spr.loaded )
		{
			// const rectRect = Rect.FromXYWH( worldPos.x,worldPos.y,srcSize.x,srcSize.y )
			// if( centered ) rectRect.MoveBy( rectRect.GetHalfSize().Scale( -1 ) )
			// if( this.camRect.Overlaps( rectRect ) )
			{
				const drawPos = this.World2ScrPos( worldPos.Copy().Subtract( this.camPos ) )
				// if( centered ) drawPos.Subtract( spr.rect.GetHalfSize().Scale( this.scale ) )
				// this.gfx.DrawSprite( drawPos.x,drawPos.y,spr,flipped,this.scale )
				
				this.gfx.context.drawImage( spr.sprite,
					srcLoc.x,srcLoc.y, // source loc
					srcSize.x,srcSize.y, // source size
					drawPos.x,drawPos.y, // draw pos
					letterSize.x * this.scale,letterSize.y * this.scale ) // draw scaling
			}
		}
	}
	
	DrawRect( worldPos,width,height,color,centered = false )
	{
		const rectRect = Rect.FromXYWH( 0,0,width,height )
		const rectPos = worldPos.Copy()
		if( centered ) rectPos.Subtract( rectRect.GetHalfSize() )
		rectRect.MoveTo( rectPos )
		if( this.camRect.Overlaps( rectRect ) )
		{
			const drawPos = this.World2ScrPos( worldPos.Copy().Subtract( this.camPos ) )
			if( centered ) drawPos.Subtract( rectRect.GetHalfSize().Scale( this.scale ) )
			this.gfx.DrawRect( drawPos.x,drawPos.y,
				rectRect.GetWidth() * this.scale,
				rectRect.GetHeight() * this.scale,
				color )
		}
	}
	
	DrawCamArea()
	{
		this.camRect.Draw( this,"#33CC77" )
		
		// const staticCamRect = this.camRect.Copy()
		// staticCamRect.MoveTo( new Vec2( -this.camRect.GetWidth() / 2,-this.camRect.GetHeight() / 2 ) )
		// this.DrawRect( staticCamRect.GetTopLeft(),staticCamRect.GetWidth(),staticCamRect.GetHeight(),"#33CC77" )
	}
	
	DrawPolygon( points,color,line = false )
	{
		if( points.length == 0 ) return
		
		const ctx = this.gfx.context
		ctx.beginPath()
		
		const startPos = this.World2ScrPos( points[0].Copy().Subtract( this.camPos ) )
		
		ctx.moveTo( startPos.x,startPos.y )
		for( let i = 1; i < points.length; ++i )
		{
			const curPos = this.World2ScrPos( points[i].Copy().Subtract( this.camPos ) )
			ctx.lineTo( curPos.x,curPos.y )
		}
		
		ctx.closePath()
		if( line )
		{
			ctx.strokeStyle = color
			ctx.lineWidth = 3
			ctx.stroke()
		}
		else
		{
			ctx.fillStyle = color
			ctx.fill()
		}
	}
	
	Scr2WorldPos( screenPos )
	{
		return( screenPos.Copy().Subtract( this.screenHSize )
			.Divide( this.scale != 0 ? this.scale : 1 )
			// .Add( this.camPos )
			)
	}
	World2ScrPos( worldPos )
	{
		return( worldPos.Copy()
			// .Subtract( this.camPos )
			.Scale( this.scale )
			.Add( this.screenHSize ) )
	}
	GetMouseWorldPos( mouse )
	{
		return( this.Scr2WorldPos( new Vec2( mouse.x,mouse.y ) ).Add( this.camPos ) )
	}
	
	GetCamArea()
	{
		return( this.camRect )
	}
	
	GetCamPos()
	{
		return( this.camPos )
	}
}

NekoCam.PixelSize = 1