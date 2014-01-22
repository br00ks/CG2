/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Fragment Phong Shader to be extended to a "Planet" shader.
 *
 * expects position and normal vectors in eye coordinates per vertex;
 * expects uniforms for ambient light, directional light, and phong material.
 * 
 *
 */

precision mediump float;

// position and normal in eye coordinates
varying vec4  ecPosition;
varying vec3  ecNormal;
//varying-Variable für den fs-->kommt vom vs
varying vec2 texCoord; // input from vertex shader

// TEXTURES
uniform sampler2D daylightTexture; 
uniform sampler2D nightTexture; 
uniform sampler2D bathymetryTexture;
uniform sampler2D cloudsTexture;

 
// transformation matrices
uniform mat4  modelViewMatrix;
uniform mat4  projectionMatrix;

// Ambient Light
uniform vec3 ambientLight;

uniform bool debug;
uniform bool daylight;
uniform bool nightlights;
uniform bool bathymetry;
uniform bool glossmap;
uniform bool clouds;

// Material
struct PhongMaterial {
    vec3  ambient;
    vec3  diffuse;
    vec3  specular;
    float shininess;
};
uniform PhongMaterial material;

// Light Source Data for a directional light
struct LightSource {

    int  type;
    vec3 direction;
    vec3 color;
    bool on;
    
} ;
uniform LightSource light;

/*

 Calculate surface color based on Phong illumination model.
 - pos:  position of point on surface, in eye coordinates
 - n:    surface normal at pos
 - v:    direction pointing towards the viewer, in eye coordinates
 + assuming directional light
 
 */
vec3 phong(vec3 pos, vec3 n, vec3 v, LightSource light, PhongMaterial material) {

    vec3 colornight = texture2D(nightTexture, texCoord).rgb;
    vec3 colorday = texture2D(daylightTexture, texCoord).rgb;
    vec3 colorbathymetry = texture2D(bathymetryTexture, texCoord).rgb;
    float colorclouds = texture2D(cloudsTexture, texCoord).r;

    if(clouds) {
        //testweise wolken ausgeben
        //return vec3(colorclouds,colorclouds,colorclouds);
        //desto dichter die Wolken sind, desto  mehr sollte die Wolkenfarbe die Erdfarbe überdecken
        if(colorclouds * 255.0 < 100.0) {
            return vec3(colorclouds,colorclouds,colorclouds);
        } else {
            return vec3(0,0,0);
        }
    }

    // ambient part
    vec3 ambient = material.ambient * ambientLight * 0.0;
    if (!daylight && !nightlights) {
        ambient = material.ambient * ambientLight;
    }
    
    // back face towards viewer (looking at the earth from the inside)?
    float ndotv = dot(n,v);
    if(ndotv<0.0) 
        return vec3(0,0,0);
    
    // vector from light to current point
    vec3 l = normalize(light.direction);
    
    // cos of angle between light and surface. 
    float ndotl = dot(n,-l);



    
    // diffuse contribution
    vec3 diffuse = material.diffuse * light.color * ndotl;
    if (daylight) {
        if (nightlights) {
            diffuse = 2.0 * colorday * ndotl + colornight * pow((1.0 - ndotl),2.5) * light.color;

            // begonnen mit colorday * ndotl + colornight * light.color
            // dann colorday * ndotl + colornight * ndotl * light.color;
            // aber falsch, weil colorday und colornight nicht die gleiche gewichtung ndotl haben!
            // daher colornight mit (1 - ndotl) multiplizieren

        } else {
            diffuse = 2.0 * colorday * ndotl * light.color;
        }
    } else {
        diffuse = material.diffuse * light.color * ndotl;
    }
    
     // reflected light direction = perfect reflection direction
    vec3 r = reflect(l,n);
        
    // angle between reflection dir and viewing dir
    float rdotv = max( dot(r,v), 0.0);
 
    // specular contribution
    vec3 specular = material.specular * light.color * pow(rdotv, material.shininess);

    if(glossmap) {
        if((colorbathymetry.r * 255.0) < 100.0) {
            specular = material.specular*0.5 * light.color * pow(rdotv, material.shininess);
        } else {
            specular = material.specular*1.0 * light.color * pow(rdotv, material.shininess/10.0);
        }
    }


    if(debug){
        if(ndotl >= 0.0 && ndotl <= 0.03) {
            return vec3(0,1,0);   
        }
    }

    if(bathymetry){
        if(colorbathymetry.r * 255.0 < 100.0) {
            return vec3(0,1,0);
        } else {
            return vec3(1,0,0);
        }
    }
    
    if(ndotl<=0.0) 
        if (nightlights) {
            return colornight;
        } else if (daylight) {
            return colorday * vec3(0.08,0.08,0.08); // shadow / facing away from the light source
        } 


    // return sum of all contributions
    return ambient + diffuse + specular;

}


void main() {
    
    // normalize normal after projection
    vec3 normalEC = normalize(ecNormal);
    
    // do we use a perspective or an orthogonal projection matrix?
    bool usePerspective = projectionMatrix[2][3] != 0.0;
    
    // for perspective mode, the viewing direction (in eye coords) points
    // from the vertex to the origin (0,0,0) --> use -ecPosition as direction.
    // for orthogonal mode, the viewing direction is simply (0,0,1)
    vec3 viewdirEC = usePerspective? normalize(-ecPosition.xyz) : vec3(0,0,1);
    
    // calculate color using phong illumination
    vec3 color = phong( ecPosition.xyz, normalEC, viewdirEC,
                        light, material );
    if (debug) {
        if (mod(texCoord.s , 0.1) < 0.05) {
            color = color * 0.5;
        } 
    }


    gl_FragColor = vec4(color, 1.0);
    
}
