using Type = Uart*;
struct State {
    uint8_t mem[sizeof(HardwareUart)];
    HardwareUart* uart;
};

{{ GENERATED_CODE }}

void evaluate(Context ctx) {
    auto state = getState(ctx);
    state->uart = new (state->mem) HardwareUart(SERIAL_PORT_HARDWARE_OPEN, (uint32_t) getValue<input_BAUD>(ctx));
    emitValue<output_UART>(ctx, state->uart);
}
