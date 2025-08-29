export default function ColorPicker({
  defaultValue = "#f00",
  onChange = () => { },
}) {
  return (
    <div className="crhmext-color-picker">
      <input
        type="color"
        id="colorPicker"
        name="colorPicker"
        className="crhmext-color-picker"
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
}