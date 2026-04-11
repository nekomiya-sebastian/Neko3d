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
		
		this.version = "0.2.0"
		this.disableUI = false
		
		this.scenes = [
			new CubeTestScene(),
			new MikesRaftScene(),
			new LightingTestScene()
		]
		this.curScene = -1
		
		this.menuButtons = [
			new TextButton( Vec2.Zero(),"Cube Test",this.textDrawer ),
			new TextButton( Vec2.Zero(),"My Raft",this.textDrawer ),
			new TextButton( Vec2.Zero(),"Lighting Test",this.textDrawer )
		]
		
		this.backButton = new TextButton( Vec2.Zero(),"< Main Menu",this.textDrawer )
	}
	
	Update( dt )
	{
		if( this.curScene < 0 ) // main menu
		{
			for( let i = 0; i < this.menuButtons.length; ++i )
			{
				if( this.menuButtons[i].Update( this.mouse,this.nekoCam ) )
				{
					this.curScene = i
				}
			}
		}
		else // 3d scenes
		{
			const sceneData = {
				mouse: this.mouse,
				kbd: this.kbd,
				dt: dt,
				neko3dDrawer: this.neko3dDrawer,
				nekoCam: this.nekoCam
			}
			
			this.scenes[this.curScene].Update( sceneData )
			
			if( this.backButton.Update( this.mouse,this.nekoCam ) )
			{
				this.scenes[this.curScene].UnloadScene()
				this.curScene = -1
			}
		}
	}
	
	Draw()
	{
		this.nekoCam.DrawCamArea()
		
		if( this.curScene < 0 )
		{
			const menuItemPos = this.nekoCam.GetCamArea().GetCenter().Add( Vec2.Up().Scale( 30 ) )
			const menuItemSize = 12
			
			this.textDrawer.DrawText( "Snekos3d Main Menu",
				menuItemPos,
				this.nekoCam,true,true )
			
			for( const button of this.menuButtons )
			{
				menuItemPos.Add( Vec2.Down().Scale( menuItemSize ) )
				button.MoveTo( menuItemPos.x,menuItemPos.y,true )
				button.Draw( this.nekoCam,this.textDrawer )
			}
		}
		else
		{
			this.neko3dDrawer.ClearQueue()
			
			this.scenes[this.curScene].Draw3d( this.neko3dDrawer )
			
			this.neko3dDrawer.Draw( this.nekoCam,this.scenes[this.curScene].Get3dCam() )
			
			if( !this.disableUI )
			{
				this.scenes[this.curScene].DrawUI( this.nekoCam,this.textDrawer )
				
				const backButtonPos = this.nekoCam.GetCamArea().GetTopLeft().Copy()
					.Add( new Vec2( 24,5 ) )
				this.backButton.MoveTo( backButtonPos.x,backButtonPos.y )
				this.backButton.Draw( this.nekoCam,this.textDrawer )
			}
		}
			
		this.textDrawer.DrawAlignedText( "Snekos3d v" + this.version,
			this.nekoCam.GetCamArea().GetTopRight().Copy().Add( new Vec2( -2,2 ) ),
			this.nekoCam,
			TextDrawer.Alignment.Max )
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