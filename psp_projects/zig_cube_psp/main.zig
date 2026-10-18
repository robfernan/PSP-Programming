const std = @import("std");

// PlayStation Portable Target Constants
pub const PSP_SCREEN_WIDTH = 480;
pub const PSP_SCREEN_HEIGHT = 272;

pub fn main() !void {
    // Zig-PSP entrypoint demonstration
    // Native compilation without legacy GCC toolchain dependencies
    std.debug.print("Initializing Zig PSP Homebrew Demo...\n", .{});
}
