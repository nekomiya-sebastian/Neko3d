class TextDrawer
{
	constructor()
	{
		this.startLetter = 32
		this.endLetter = 126
		const nLetters = this.endLetter - this.startLetter
		
		this.letterSpr = new Sprite( "Images/NekoFont3x6.png" )
		this.letterSize = new Vec2( 3,6 )
	}
	
	DrawText( text,pos,nekoCam,centerX = false,centerY = false )
	{
		this.DrawAlignedText( text,pos,nekoCam,
			centerX ? TextDrawer.Alignment.Center : TextDrawer.Alignment.Min,
			centerY ? TextDrawer.Alignment.Center : TextDrawer.Alignment.Min )
	}
	
	DrawAlignedText( text,pos,nekoCam,alignX,alignY )
	{
		let drawX = pos.x
		let drawY = pos.y
		
		const totalWidth = text.length * ( this.letterSize.x + 1 )
		const totalHeight = this.letterSize.y
		switch( alignX )
		{
			case TextDrawer.Alignment.Center: drawX -= totalWidth / 2
				break;
			case TextDrawer.Alignment.Max: drawX -= totalWidth
				break;
		}
		switch( alignY )
		{
			case TextDrawer.Alignment.Center: drawY -= totalHeight / 2
				break;
			case TextDrawer.Alignment.Max: drawY -= totalHeight
				break;
		}
		
		for( let i = 0; i < text.length; ++i )
		{
			const charCode = text.charCodeAt( i )
			if( charCode >= this.startLetter && charCode <= this.endLetter )
			{
				const letterInd = charCode - this.startLetter
				
				const srcLoc = new Vec2( letterInd * ( this.letterSize.x + 1 ),0 )
				const srcSize = this.letterSize
				const letterSize = this.letterSize
				const drawPos = new Vec2( drawX + i * ( this.letterSize.x + 1 ),drawY )
				
				nekoCam.DrawClippedSprite( this.letterSpr,
					srcLoc,srcSize,letterSize,drawPos )
				
				// gfx.context.drawImage( this.letterSpr.sprite,
				// 	letterInd * ( this.letterSize.x + 1 ),0, // source loc
				// 	this.letterSize.x,this.letterSize.y, // source size
				// 	drawX + i * ( this.letterSize.x + 1 ) * scale,drawY, // draw pos
				// 	this.letterSize.x * scale,this.letterSize.y * scale ) // draw scaling
			}
			else
			{
				NekoUtils.Assert( false,"Trying to render invalid character: " + text[i] )
			}
		}
	}
	
	CalcTextHitbox( text )
	{
		const totalWidth = text.length * ( this.letterSize.x + 1 )
		const totalHeight = this.letterSize.y
		return( new Vec2( totalWidth,totalHeight ) )
	}
}

TextDrawer.Alignment = {
	Min: 0,
	Center: 1,
	Max: 2
}