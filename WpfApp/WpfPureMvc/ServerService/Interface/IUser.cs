namespace ServerService.Interface
{
    public interface IUser
    {
        bool Login(string user, string password);
        bool Logout(string user, string password);
    }
}