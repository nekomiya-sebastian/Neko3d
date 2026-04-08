class Mouse
{
	constructor( gfx )
	{
		const canv = gfx.canvas
		
		this.down = false
		this.x = 0
		this.y = 0
		
		this.usingTouch = false
		
		const self = this
		
		canv.addEventListener( "mousedown",function( e )
		{
			if( e.button == 0 ) self.down = true
			
			self.usingTouch = false
		} )
		canv.addEventListener( "mouseup",function( e )
		{
			if( e.button == 0 ) self.down = false
			
			self.usingTouch = false
		} )
		canv.addEventListener( "mousemove",function( e )
		{
			self.SetMousePos( e.clientX,e.clientY,self,canv )
			
			self.usingTouch = false
		} )
		
		canv.addEventListener( "touchstart",function( e )
		{
			e.preventDefault()
			self.SetMousePos( e.touches[0].clientX,e.touches[0].clientY,self,canv )
			
			self.down = true
			
			self.usingTouch = true
		} )
		canv.addEventListener( "touchmove",function( e )
		{
			e.preventDefault()
			self.SetMousePos( e.touches[0].clientX,e.touches[0].clientY,self,canv )
			
			self.down = true
			
			self.usingTouch = true
		} )
		canv.addEventListener( "touchend",function( e )
		{
			e.preventDefault()
			
			self.down = false
			
			self.usingTouch = true
		} )
	}
	
	SetMousePos( inputX,inputY,self,canv )
	{
		// const boundingRect = canv.getBoundingClientRect()
		// const docElement = document.documentElement
		
		self.x = inputX// - boundingRect.left - docElement.scrollLeft
		self.y = inputY// - boundingRect.top - docElement.scrollTop
	}
}