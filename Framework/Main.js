class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.mouse = new Mouse( this.gfx )
		this.kbd = new Keyboard( this.gfx )
		this.nekoCam = new NekoCam( this.gfx )
		this.gfx.SetNekoCam( this.nekoCam )
		
		this.neko3dDrawer = new Neko3dDrawer()
		this.textDrawer = new TextDrawer()
		
		this.version = "0.1.0"
		this.disableUI = false
		
		this.scenes = [
			new CubeTestScene(),
			new MikesRaftScene()
		]
		this.curScene = 1
	}
	
	Update( dt )
	{
		this.scenes[this.curScene].Update( this.mouse,this.kbd,dt )
	}
	
	Draw()
	{
		this.nekoCam.DrawCamArea()
		
		this.scenes[this.curScene].Draw3d( this.neko3dDrawer )
		
		this.neko3dDrawer.Draw( this.nekoCam,this.scenes[this.curScene].Get3dCam() )
		
		if( !this.disableUI )
		{
			this.scenes[this.curScene].DrawUI( this.nekoCam,this.textDrawer )
		}
		
		this.textDrawer.DrawText( "Snekos3d v" + this.version,
			this.nekoCam.GetCamArea().GetTopLeft().Copy().Add( new Vec2( 2,2 ) ),
			this.nekoCam,false,false )
	}
}

const delay = 1000.0 / 60.0
const main = new Main()
let prevTime = Date.now()
setInterval( function()
{
	const now = Date.now()
	const dt = ( now - prevTime ) / 30
	prevTime = now
	
	main.Update( dt )
	main.gfx.DrawRect( 0,0,main.gfx.width,main.gfx.height,"#000000" )
	main.Draw()
},delay )