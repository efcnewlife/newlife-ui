import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "../cn";
import { sliderRange, sliderThumb, sliderTrack } from "../theme/role-classes";

export type SliderProps = SliderPrimitive.Root.Props;

const Slider = ({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderProps) => {
  const thumbValues = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max];
  const thumbCount = thumbValues.length;

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control
        className="relative flex w-full touch-none select-none items-center data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col"
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "relative h-2 w-full grow overflow-hidden rounded-full select-none data-vertical:h-full data-vertical:w-2",
            sliderTrack
          )}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className={cn(
              "select-none data-horizontal:h-full data-vertical:w-full",
              sliderRange
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            className={cn(
              "block h-4 w-4 shrink-0 rounded-full select-none disabled:pointer-events-none disabled:opacity-50",
              sliderThumb
            )}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
};

export default Slider;
