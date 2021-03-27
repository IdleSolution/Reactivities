using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
                .NotEmpty()
                .MinimumLength(6).WithMessage("Password must be atleast 6 characters long")
                .Matches("[A-Z]").WithMessage("Password must contain one upper case character")
                .Matches("[a-z]").WithMessage("Password must contain one lower case character")
                .Matches("[0-9]").WithMessage("Password must contain one numeric character")
                .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain non alphanumeric character");

            return options;
        }
    }
}