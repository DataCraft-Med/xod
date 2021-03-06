
// clang-format off
{{#global}}
#include <Triangle.h>
{{/global}}
// clang-format on

struct State {
    uint8_t mem[sizeof(TriangleSolid)];
    TriangleSolid* triangleSolidColored;
    int16_t x0, y0, x1, y1, x2, y2;
    XColor fillColor;
};

// clang-format off
{{ GENERATED_CODE }}
// clang-format on

void evaluate(Context ctx) {
    auto state = getState(ctx);

    auto gfx = getValue<input_GFX>(ctx);
    state->fillColor = getValue<input_C>(ctx);

    int16_t x0 = (int16_t)getValue<input_X0>(ctx);
    int16_t y0 = (int16_t)getValue<input_Y0>(ctx);
    int16_t x1 = (int16_t)getValue<input_X1>(ctx);
    int16_t y1 = (int16_t)getValue<input_Y1>(ctx);
    int16_t x2 = (int16_t)getValue<input_X2>(ctx);
    int16_t y2 = (int16_t)getValue<input_Y2>(ctx);

    if (isSettingUp()) {
        state->triangleSolidColored = new (state->mem) TriangleSolid(gfx);
    }

    if (isSettingUp() || x0 != state->x0 || y0 != state->y0 || x1 != state->x1 || y1 != state->y1 || x2 != state->x2 || y2 != state->y2 || isInputDirty<input_C>(ctx)) {
        state->x0 = x0;
        state->y0 = y0;
        state->x1 = x1;
        state->y1 = y1;
        state->x2 = x2;
        state->y2 = y2;
        state->triangleSolidColored->setPosition(x0, y0, x1, y1, x2, y2);
        state->triangleSolidColored->setStyle(&state->fillColor);
        emitValue<output_GFXU0027>(ctx, state->triangleSolidColored);
    }

    if (isInputDirty<input_GFX>(ctx)) {
        emitValue<output_GFXU0027>(ctx, state->triangleSolidColored);
    }
}
