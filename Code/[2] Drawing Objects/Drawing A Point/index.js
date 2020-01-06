main( );

function main( )
{
	const canvas = document.querySelector( "#glcanvas" );

	const gl = canvas.getContext( "webgl" );

	if ( !gl )
	{
		alert( "Unable to setup WebGL. Your browser or computer may not support it." );

		return;
	}

	var vertices = [
	   0.0, 0.0, 0.0,
       0.5, -0.5, 0.0,
       1.0, 1.0, 0.0
    ];

    // Create an empty buffer object to store the vertex buffer
    var vertex_buffer = gl.createBuffer( );

    //Bind appropriate array buffer to it
    gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );

    // Pass the vertex data to the buffer
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

    // Unbind the buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    var vertCode =
	    'attribute vec3 coordinates;' +

	    'void main(void)' +
	    '{' +
	       ' gl_Position = vec4(coordinates, 1.0);' +
	       'gl_PointSize = 10.0;'+
	    '}';

    // Create a vertex shader object
    var vertShader = gl.createShader( gl.VERTEX_SHADER );
    
    // Attach vertex shader source code
    gl.shaderSource( vertShader, vertCode );

    // Compile the vertex shader
    gl.compileShader( vertShader );

    // fragment shader source code
    var fragCode =
	    'void main(void)' +
	    '{' +
	       ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
	    '}';

    // Create fragment shader object
    var fragShader = gl.createShader( gl.FRAGMENT_SHADER );

    // Attach fragment shader source code
    gl.shaderSource( fragShader, fragCode );

    // Compile the fragmentt shader
    gl.compileShader( fragShader );
    
    // Create a shader program object to store the combined shader program
    var shaderProgram = gl.createProgram( );

    // Attach a vertex shader
    gl.attachShader( shaderProgram, vertShader ); 

    // Attach a fragment shader
    gl.attachShader( shaderProgram, fragShader );

    // Link both programs
    gl.linkProgram( shaderProgram );

    // Use the combined shader program object
    gl.useProgram( shaderProgram );

    // Bind vertex buffer object
    gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );

    // Get the attribute location
    var coord = gl.getAttribLocation( shaderProgram, "coordinates" );

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer( coord, 3, gl.FLOAT, false, 0, 0 );

    // Enable the attribute
    gl.enableVertexAttribArray( coord );


	gl.clearColor( 1.0, 0.0, 0.0, 1.0 );

	// Enable the depth test
    gl.enable( gl.DEPTH_TEST );
 
	gl.clear( gl.COLOR_BUFFER_BIT );

	// Set the view port
    gl.viewport( 0, 0, canvas.width,canvas.height );

    // Draw the triangle
    gl.drawArrays( gl.POINTS, 0, 3 );
}











