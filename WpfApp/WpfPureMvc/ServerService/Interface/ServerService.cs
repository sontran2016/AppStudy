using PureMVC.Interfaces;

namespace ServerService.Interface
{
    public interface IServerService
    {
        INotification HandleService(INotification notify);
    }
}