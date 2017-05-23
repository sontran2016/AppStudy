using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace GaugeBoard
{
    public sealed class RelayCommand : ICommand
    {
        #region " Declarations "

        private readonly Predicate<object> _canExecuteMethod;
        private readonly Action<object> _executeMethod;

        #endregion

        #region " Events "

        public event EventHandler CanExecuteChanged
        {
            add
            {
                if (_canExecuteMethod != null)
                {
                    CommandManager.RequerySuggested += value;
                }
            }
            remove
            {
                if (_canExecuteMethod != null)
                {
                    CommandManager.RequerySuggested -= value;
                }
            }
        }

        #endregion

        #region " Constructor "

        public RelayCommand(Action<object> executeMethod)
            : this(executeMethod, null)
        {
        }

        public RelayCommand(Action<object> executeMethod, Predicate<object> canExecuteMethod)
        {
            if (executeMethod == null)
            {
                throw new ArgumentNullException("executeMethod", "Delegate comamnds can not be null");
            }

            _executeMethod = executeMethod;
            _canExecuteMethod = canExecuteMethod;
        }

        #endregion

        #region " Methods "
        public bool CanExecute(object parameter)
        {
            return _canExecuteMethod == null || _canExecuteMethod(parameter);
        }

        public void Execute(object parameter)
        {
            if (_executeMethod != null)
                _executeMethod(parameter);
        }
        #endregion
    }
}
