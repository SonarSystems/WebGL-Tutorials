main( );

function NormalisedToDevice( coord, axisSize )
{
	var halfAxisSize = axisSize / 2;

	var deviceCoord = ( coord + 1 ) * halfAxisSize;

	return deviceCoord;
}

function DeviceToNormalised( coord, axisSize )
{
	var halfAxisSize = axisSize / 2;

	var normalisedCoord = ( coord / halfAxisSize ) - 1;

	return normalisedCoord;
}

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
    	-0.5, 0.5, 0.0, // 1
        -0.5, -0.5, 0.0, // 2
        0.5, -0.5, 0.0, // 3
        0.5, 0.5, 0.0  // 4
     ];

    var indices = [3, 2, 1, 3, 1, 0];

	var vertex_buffer = gl.createBuffer( );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );

	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	gl.bindBuffer( gl.ARRAY_BUFFER, null );

	// Create an empty buffer object to store Index buffer
    var Index_Buffer = gl.createBuffer( );

    // Bind appropriate array buffer to it
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, Index_Buffer );

    // Pass the vertex data to the buffer
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array (indices ), gl.STATIC_DRAW );
    
    // Unbind the buffer
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );

	var vertCode = 
		'attribute vec3 coordinates;' +
		'void main(void)' +
		'{' +
			' gl_Position = vec4(coordinates, 1.0);' +
		'}';

	var vertShader = gl.createShader( gl.VERTEX_SHADER );

	gl.shaderSource( vertShader, vertCode );

	gl.compileShader( vertShader );

	var fragCode = 
		'void main(void)' +
		'{' +
			' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
		'}';

	var fragShader = gl.createShader( gl.FRAGMENT_SHADER );

	gl.shaderSource( fragShader, fragCode );

	gl.compileShader( fragShader );

	var shaderProgram = gl.createProgram( );

	gl.attachShader( shaderProgram, vertShader );

	gl.attachShader( shaderProgram, fragShader );

	gl.linkProgram( shaderProgram );

	gl.useProgram( shaderProgram );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );

	// Bind index buffer object
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, Index_Buffer );

	var coord = gl.getAttribLocation( shaderProgram, "coordinates" );

	gl.vertexAttribPointer( coord, 3, gl.FLOAT, false, 0, 0 );

	gl.enableVertexAttribArray( coord );

	gl.clearColor( 1.0, 0.0, 0.0, 1.0 );

	gl.enable( gl.DEPTH_TEST );

	gl.clear( gl.COLOR_BUFFER_BIT );

	gl.viewport( 0, 0, canvas.width, canvas.height );

	gl.drawElements( gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );
}











