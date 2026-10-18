// PlayStation Portable (PSP) 3D Geometry in pure Zig
// Exports zig_render_step which calculates vertices and draws via PSP GU

pub const Vertex = extern struct {
    u: u16 = 0,
    v: u16 = 0,
    color: u32,
    x: f32,
    y: f32,
    z: f32,
};

extern fn sceGuColor(color: u32) void;
extern fn sceGuDrawArray(prim: c_int, vtype: c_int, count: c_int, indices: ?*const anyopaque, vertices: ?*const anyopaque) void;

// PSP GU constants
const GU_TRIANGLES: c_int = 3;
const GU_COLOR_8888: c_int = 0x00000300;
const GU_VERTEX_32BITF: c_int = 0x0000000c;
const GU_TRANSFORM_2D: c_int = 0x00000000;

export fn zig_render_step(angle: f32) callconv(.c) void {
    // Dynamic animated floating square/cube faces drawn from Zig
    const cx: f32 = 240.0;
    const cy: f32 = 136.0;
    const size: f32 = 50.0;

    // Use angle to offset coordinates
    const offset_x: f32 = @as(f32, @floatFromInt(@rem(@as(i32, @intFromFloat(angle)), 40))) - 20.0;

    const vertices align(16) = [_]Vertex{
        // First Triangle (Cyan)
        .{ .color = 0xFF00E5FF, .x = cx - size + offset_x, .y = cy - size, .z = 0 },
        .{ .color = 0xFFFF2D87, .x = cx + size + offset_x, .y = cy - size, .z = 0 },
        .{ .color = 0xFF00FF88, .x = cx + size + offset_x, .y = cy + size, .z = 0 },

        // Second Triangle (Pink & Green)
        .{ .color = 0xFF00E5FF, .x = cx - size + offset_x, .y = cy - size, .z = 0 },
        .{ .color = 0xFF00FF88, .x = cx + size + offset_x, .y = cy + size, .z = 0 },
        .{ .color = 0xFFFFDD00, .x = cx - size + offset_x, .y = cy + size, .z = 0 },
    };

    sceGuDrawArray(GU_TRIANGLES, GU_COLOR_8888 | GU_VERTEX_32BITF | GU_TRANSFORM_2D, 6, null, &vertices);
}
