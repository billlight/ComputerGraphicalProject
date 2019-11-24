window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { torus:  new Torus( 15, 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),
                         sphere1: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(1), 
                         sphere2: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(2), 
                         sphere3: new Subdivision_Sphere (3),
                         sphere4: new Subdivision_Sphere (4),
                         myshape: new MyShape(20,20, Math.PI),
                         myshape2: new MyShape2(20,20),
                         semishpere: new Semisphere(20,20)
                                // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                                //        (Requirement 1)
                       }
        this.context = context;
        this.submit_shapes( context, shapes );
                                     
                                     // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } ),
            test2:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.8 } ),
            ring:     context.get_instance( Ring_Shader  ).material(),
            mainYellow:      context.get_instance( Phong_Shader ).material( Color.of( 1, 1, 0, 1 ), { ambient: 1 } ),
            eye:      context.get_instance( Phong_Shader ).material( Color.of( 0, 0, 0, 1 ), { ambient: 1 } ),
            mouth:    context.get_instance( Phong_Shader ).material( Color.of( 1, 0.2, 0.2, 1 ), { ambient: 1 } ),
            monster:  context.get_instance( Phong_Shader ).material( Color.of( 1, 0, 0, 1 ), { ambient: 1 } )
                                // TODO:  Fill in as many additional material objects as needed in this key/value table.
                                //        (Requirement 1)
          }
          
        this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
      }
    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.vl.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

        let model_transform = Mat4.identity();
        this.shapes.sphere4.draw( graphics_state, model_transform, this.materials.test2);

        let model_transform1 = Mat4.identity().times( Mat4.scale([0.25, 0.25, 0.25]) 
                                         .times(Mat4.translation([1.65,2.2,1.8])));
        this.shapes.sphere4.draw( graphics_state, model_transform1, this.materials.eye);

        let model_transform2 = Mat4.identity().times( Mat4.scale([0.25, 0.25, 0.25]) 
                                         .times(Mat4.translation([-1.65,2.2,1.8])));
        this.shapes.sphere4.draw( graphics_state, model_transform2, this.materials.eye);

        let model_transform3 = Mat4.identity().times( Mat4.scale([0.15, 0.15, 0.35]) 
                                         .times(Mat4.translation([0,3.5,2.2])));
        this.shapes.sphere4.draw( graphics_state, model_transform3, this.materials.mainYellow);

        let model_transform5 = Mat4.identity().times( Mat4.rotation(Math.PI/10,Vec.of(1, 0, 0) ))
                                              .times( Mat4.scale([1.01, 1.01, 1.01]) )
                                              .times(Mat4.translation([0,0,0]));

        this.shapes.myshape = new MyShape(20, 20, 0.5+ 0.5 * Math.sin(4*t));

        this.context.shapes_in_use.myshape = this.shapes.myshape;
        this.submit_shapes( this.context, this.shapes );
        

        this.shapes.myshape.draw( graphics_state, model_transform5, this.materials.mouth);


        let model_transform6 = Mat4.identity().times( Mat4.translation([3,0,0]))
                                              .times( Mat4.scale([1,1,1]) )
                                              .times( Mat4.rotation(Math.PI/2,Vec.of(1, 0, 0) ) )
                                              ;
        let model_transform7 = Mat4.identity().times( Mat4.translation([3,0,0]))
                                              .times( Mat4.scale([0.3,0.3,0.3]) )
                                              .times(Mat4.translation([-1.15,0.75,2.2]));
        this.shapes.sphere4.draw( graphics_state, model_transform7, this.materials.eye);
        let model_transform8 = Mat4.identity().times( Mat4.translation([3,0,0]))
                                              .times( Mat4.scale([0.3,0.3,0.3]) )
                                              .times(Mat4.translation([1.15,0.75,2.2]));        
        this.shapes.sphere4.draw( graphics_state, model_transform8, this.materials.eye);
        
        this.shapes.myshape2.draw( graphics_state, model_transform6, this.materials.monster );     
                                         
        this.shapes.semishpere.draw( graphics_state, model_transform.times(Mat4.translation([3,0,0]).times( Mat4.rotation(Math.PI/2,Vec.of(1, 0, 0) ) )), this.materials.monster );
      }
  }


  

// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
{ material() { return { shader: this } }      // Materials here are minimal, without any settings.
  map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
    {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
                                                  // which kinds of Shapes this Shader is compatible with.  Thanks to this function, 
                                                  // Vertex buffers in the GPU can get their pointers matched up with pointers to 
                                                  // attribute names in the GPU.  Shapes and Shaders can still be compatible even
                                                  // if some vertex data feilds are unused. 
      return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
                                                                                        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        { 
          center = vec4(0,0,0,1) * model_transform;
          position = vec4( object_space_pos, 1);
          gl_Position = projection_camera_transform * model_transform * position;
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return `
        void main()
        { 
          gl_FragColor = vec4(0.68, 0.35, 0.1, 0.5 + 0.5 * sin(25.0 * distance(center, position)));

        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
    }
}

window.Grid_Sphere = window.classes.Grid_Sphere =
class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at 
  { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
      { super( "positions", "normals", "texture_coords" );
        

                      // TODO:  Complete the specification of a sphere with lattitude and longitude lines
                      //        (Extra Credit Part III)
      } }