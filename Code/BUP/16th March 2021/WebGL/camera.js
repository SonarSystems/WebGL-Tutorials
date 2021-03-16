"use strict";

var proj_matrix;
var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
const movSpeed = 0.05;

var movCyclesZForward = 0;
var movCyclesZBackward = 0;

var movCyclesXLeft = 0;
var movCyclesXRight = 0;

var previousMouseX = null;
var previousMouseY = null;


var xpos = 0, ypos = 0;

var lastX = 400, lastY = 300;

var yaw = 0, pitch = 0;

var direction = [0, 0, 0];

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

class Camera
{
	constructor( canvas )
	{
        proj_matrix = this.GetProjection( 40, canvas.width / canvas.height, 1, 100 );

		const bodyElement = document.querySelector( "body" );

        bodyElement.addEventListener( "keydown", this.ProcessKeyboardInput.bind( this ), false );
        bodyElement.addEventListener( "keyup", this.ProcessKeyboardInput.bind( this ), false );

		bodyElement.addEventListener( "mousedown", this.ProcessMouseInput.bind( this ), false );
		bodyElement.addEventListener( "mousemove", this.ProcessMouseInput.bind( this ), false );
        bodyElement.addEventListener( "mouseup", this.ProcessMouseInput.bind( this ), false );
        bodyElement.addEventListener( "wheel", this.ProcessMouseInput.bind( this ), false );
	}

    UpdateMovMatrix( matrix )
    {
        matrix[12] += view_matrix[12] * 2;
        matrix[13] += view_matrix[13] * 2;
        matrix[14] += view_matrix[14] * 2;

        return matrix;
    }

    Update( )
    {
        if ( movCyclesZForward > 0 )
        {
            view_matrix[14] += movSpeed;
            movCyclesZForward--;
        }

        if ( movCyclesZBackward > 0 )
        {
            view_matrix[14] -= movSpeed;
            movCyclesZBackward--;
        }

        if ( movCyclesXLeft > 0 )
        {
            view_matrix[12] += movSpeed;
            movCyclesXLeft--;
        }

        if ( movCyclesXRight > 0 )
        {
            view_matrix[12] -= movSpeed;
            movCyclesXRight--;
        }

        console.log( "-----START MATRIX-----" );
        console.log( view_matrix[0], view_matrix[1], view_matrix[2], view_matrix[3] );
        console.log( view_matrix[4], view_matrix[5], view_matrix[6], view_matrix[7] );
        console.log( view_matrix[8], view_matrix[9], view_matrix[10], view_matrix[11] );
        console.log( view_matrix[12], view_matrix[13], view_matrix[14], view_matrix[15] );
        console.log( "------END MATRIX------" );
        console.log( "" );
    }

	Move( event )
	{
        if ( "ArrowUp" === event.key )
        {
            if ( movCyclesZForward === 0 )
            {
                movCyclesZForward += 30;
            }
            else if ( movCyclesZForward < 20 )
            {
                movCyclesZForward += 10;
            }
        }
        else if ( "ArrowDown" === event.key )
        {
            if ( movCyclesZBackward === 0 )
            {
                movCyclesZBackward += 30;
            }
            else if ( movCyclesZBackward < 20 )
            {
                movCyclesZBackward += 10;
            }
        }

        if ( "ArrowLeft" === event.key )
        {
            if ( movCyclesXLeft === 0 )
            {
                movCyclesXLeft += 30;
            }
            else if ( movCyclesXLeft < 20 )
            {
                movCyclesXLeft += 10;
            }
        }
        else if ( "ArrowRight" === event.key )
        {
            if ( movCyclesXRight === 0 )
            {
                movCyclesXRight += 30;
            }
            else if ( movCyclesXRight < 20 )
            {
                movCyclesXRight += 10;
            }
        }
	}

    Scroll( event )
    {
        // move the camera forwards and backwards using the mouse wheel
        if ( event.wheelDeltaY )
        {
           view_matrix[14] += 0.005 * event.wheelDeltaY;
        }
    }

	Rotate( )
	{

	}

	ProcessKeyboardInput( event )
	{
		//console.log( event );

        this.Move( event );
	}

	ProcessMouseInput( event )
	{
        var xoffset = event.clientX - lastX;
        var yoffset = lastY - event.clientY; // reversed since y-coordinates range from bottom to top
        lastX = event.clientX;
        lastY = event.clientY;

        var sensitivity = 0.005;
        xoffset *= sensitivity;
        yoffset *= sensitivity;

        yaw   += xoffset;
        pitch += yoffset;

        
        //direction[0] = Math.cos(Math.radians(yaw)) * Math.cos(Math.radians(pitch));
        //direction[1] = Math.sin(Math.radians(pitch));
        //direction[2] = Math.sin(Math.radians(yaw)) * Math.cos(Math.radians(pitch));

        //this.RotateX(view_matrix, direction[0]);
        //this.RotateY(view_matrix, direction[1]);
        //this.RotateZ(view_matrix, direction[2]);

        this.Scroll( event );

        if ( event.ctrlKey )
        {
            var currentVMPosX = view_matrix[12];
            var currentVMPosY = view_matrix[13];
            var currentVMPosZ = view_matrix[14];

            //view_matrix[12] *= -1;
            //view_matrix[13] *= -1;
            //view_matrix[14] *= -1;

            if ( null === previousMouseX )
            {
                previousMouseX = event.clientX;
            }

            if ( null === previousMouseY )
            {
                previousMouseY = event.clientY;
            }

            if ( event.clientX < previousMouseX ) // looking left
            {
                console.log( "Looking left" );

                this.RotateY( view_matrix, -0.1 );
            }
            else if ( event.clientX > previousMouseX ) // looking right
            {
                console.log( "Looking Right" );

                this.RotateY( view_matrix, 0.1 );
            }

            if ( event.clientY < previousMouseY ) // looking up
            {
                console.log( "Looking Up" );

                this.RotateX( view_matrix, -0.1 );
            }
            else if ( event.clientY > previousMouseY ) // looking down
            {
                console.log( "Looking Down" );

                this.RotateX( view_matrix, 0.1 );
            }

            previousMouseX = event.clientX;
            previousMouseY = event.clientY;

            view_matrix[12] = currentVMPosX;
            view_matrix[13] = currentVMPosY;
            view_matrix[14] = currentVMPosZ;
        }

        // 1 0 0 0 - 0
        // 0 1 0 0 - 5
        // 0 0 1 0 - 10
        // 0 0 0 1 

        //view_matrix[12] = direction[0];
        //view_matrix[13] = direction[1];
        //view_matrix[14] = direction[2];

	}

	GetProjection( angle, a, zMin, zMax )
    {
       var ang = Math.tan( ( angle * 0.5 ) * Math.PI / 180 );
       
       return [
          0.5 / ang, 0 , 0, 0,
          0, 0.5 * a / ang, 0, 0,
          0, 0, - ( zMax + zMin ) / ( zMax - zMin ), -1,
          0, 0, ( -2 * zMax * zMin ) / ( zMax - zMin ), 0 
       ];
    }

    RotateX( m, angle )
    {
    	var c = Math.cos( angle );
    	var s = Math.sin( angle );
    	var mv1 = m[1], mv5 = m[5], mv9 = m[9];

    	m[1] = m[1] * c - m[2] * s;
    	m[5] = m[5] * c - m[6] * s;
    	m[9] = m[9] * c - m[10] * s;

    	m[2] = m[2] * c + mv1 * s;
    	m[6] = m[6] * c + mv5 * s;
    	m[10] = m[10] * c + mv9 * s;
    }

    RotateY( m, angle )
    {
    	var c = Math.cos( angle );
    	var s = Math.sin( angle );
    	var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    	m[0] = c * m[0] + s * m[2];
    	m[4] = c * m[4] + s * m[6];
    	m[8] = c * m[8] + s * m[10];

    	m[2] = c * m[2] - s * mv0;
    	m[6] = c * m[6] - s * mv4;
    	m[10] = c * m[10] - s * mv8;
    }

    RotateZ( m, angle )
    {
    	var c = Math.cos( angle );
    	var s = Math.sin( angle );
    	var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    	m[0] = c * m[0] - s * m[1];
    	m[4] = c * m[4] - s * m[5];
    	m[8] = c * m[8] - s * m[9];

    	m[1]=c * m[1] + s * mv0;
    	m[5]=c * m[5] + s * mv4;
    	m[9]=c * m[9] + s * mv8;
    }
}