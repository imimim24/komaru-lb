// thebookofshaders.com/edit.php lol i took it from there and imported it.
#version 330

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

out vec4 fragColor;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 st = fragCoord / resolution;
    st.x *= resolution.x / resolution.y;

    vec3 color = vec3(0.0);
    color = vec3(st.x, st.y, abs(sin(time)));

    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}