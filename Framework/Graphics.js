class Graphics
{
	constructor()
	{
		this.canvas = document.getElementById( "nekocanv" )
		this.context = this.canvas.getContext( "2d" )
		
		this.context.imageSmoothingEnabled = false
		this.context.mozImageSmoothingEnabled = false
		
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		
		this.width = this.canvas.width
		this.height = this.canvas.height
		
		// console.log( this.width + " " + this.height )
		
		this.nekoCam = null
		
		const self = this
		addEventListener( "resize",function( e )
		{
			self.UpdateCanvSize( self )
		} );
	}
	
	UpdateCanvSize( self )
	{
		self.width = self.canvas.width = window.innerWidth
		self.height = self.canvas.height = window.innerHeight
		
		self.context.imageSmoothingEnabled = false
		self.context.mozImageSmoothingEnabled = false
		
		if( self.nekoCam ) self.nekoCam.OnResize( self.nekoCam )
	}
	
	SetNekoCam( nekoCam )
	{
		this.nekoCam = nekoCam
		this.UpdateCanvSize( this )
	}
	
	DrawRect( x,y,w,h,c )
	{
		this.context.fillStyle = c
		this.context.fillRect( Math.floor( x ),Math.floor( y ),
			Math.floor( w ),Math.floor( h ),c )
	}
	
	DrawSprite( x,y,sprite,flipped = false,scale = 1 )
	{
		if( flipped )
		{
			this.context.save()
			this.context.translate( this.width,0 )
			this.context.scale( -1,1 )
			
			this.context.drawImage( sprite.sprite,this.width - x,y,
				-sprite.GetWidth() * scale,sprite.GetHeight() * scale )
			
			this.context.scale( -1,1 )
			this.context.translate( -this.width,0 )
		}
		else this.context.drawImage( sprite.sprite,x,y,sprite.GetWidth() * scale,sprite.GetHeight() * scale )
	}
}