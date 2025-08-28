import Icons from '../Icons';

export default function Button({
  label = null,
  onClick = undefined,
  disabled = false,
  variant = 'primary',
  icon = null
}) {

  function getIcon(icon) {
    switch (icon) {
      case 'clear':
        return <Icons value='clear' />
      case 'undo':
        return <Icons value='undo' />
      case 'redo':
        return <Icons value='redo' />
      case 'screenshot':
        return <Icons value='screenshot' />
    }
  }

  return (
    <button
      onClick={onClick}
      className={`crhmext-button crhmext-button--${variant}`}
      disabled={disabled}
    >
      {icon ? getIcon(icon) : null}
      {label ? label : null}
    </button>
  );
}